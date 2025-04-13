"use server";
import "server-only";

import { ServerActionResponse } from "@/features/common/server-action-response";
import mongoDbConnection from "@/features/common/services/mongo";
import { UserBaseModel, getCurrentUser } from "./helpers";
import bcrypt from "bcryptjs";
import { RevalidateCache } from "../common/navigation-helpers";
import { UserModel } from "@/schemas/models";
import { ChangePasswordModel } from "../common/models";
import { User } from "@/schemas/user";

const LOCKOUT_DURATION = 5 // in min
const MAX_FAILED_LOGIN = 3

type UserFilterProps = {
    isActive?: boolean;
}

export const LoginAsync = async (
    credentials: {email: string, password: string}
): Promise<ServerActionResponse<UserModel>> => {
    try {
        await mongoDbConnection();
        const resource = await User.findOne({
            email: credentials.email,
        });

        if(!resource){
            return {
                status: "ERROR",
                errors: [{ message: `User not found.` }],
            };
        }

        if(resource && !resource.isActive){
            return {
                status: "ERROR",
                errors: [{ message: `User deactivated!` }],
            };
        }

        if(resource && resource?.expirationDate <= new Date()){
            return {
                status: "ERROR",
                errors: [{ message: `User has expired!` }],
            };
        }

        const verifyResponse = await verifyPassword(resource._doc, credentials.password)
        if(verifyResponse.status === "ERROR"){
            return verifyResponse;
        }

        const {updatedAt, password, ...user} = resource._doc;
        return {
            status: "OK",
            response: {...user, _id: user._id.toString()},
        };
        
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const RegisterAsync = async (
    model: UserModel
): Promise<ServerActionResponse<UserModel>> => {
    try {      
        await mongoDbConnection();
        const hashedPassword = await bcrypt.hash(model.password!, 10);
        const userModel = new User({
            ...model,
            password: hashedPassword,
            lastFailedAttempts: 0,
            totalFailedAttempts: 0,
        })

        const resource = await userModel.save();
        const {updatedAt, password, ...user} = resource._doc;

        if (user) {
            return {
                status: "OK",
                response: {...user, _id: user._id.toString()},
            };
        }

        return {
            status: "ERROR",
            errors: [{ message: `Registration failed.` }],
        };
        
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const GetAllActiveUsersAsync = async (): Promise<ServerActionResponse<Array<UserModel>>> => {
    try {
        const user = await getCurrentUser();

        if(user.isAdmin){
            await mongoDbConnection();
            const resources = await User.find({ isActive: true });
            const recordUsers = resources.map<UserModel>( usr => {
            const {updatedAt, password, ...user} = usr._doc
                return {...user, _id: usr._id.toString()}
            })
            return {
                status: "OK",
                response: recordUsers,
            };
        }else{
            return {
                status: "ERROR",
                errors: [{ message: `You are not allow to proceed this task.` }],
            };
        }
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const GetAllUsersAsync = async (
    filters?: UserFilterProps
): Promise<ServerActionResponse<Array<UserModel>>> => {
    try {
        const user = await getCurrentUser();

        if(user.isAdmin){
            await mongoDbConnection();
            const resources = await User.find({...filters});
            const recordUsers = resources.map<UserModel>( usr => {
            const {updatedAt, password, ...user} = usr._doc;
                return {...user, _id: user._id.toString()}
            })
            return {
                status: "OK",
                response: recordUsers,
            };
        }else{
            return {
                status: "ERROR",
                errors: [{ message: `You are not allow to proceed this task.` }],
            };
        }
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const UpdateUserAsync = async (
    userModel: UserModel
): Promise<ServerActionResponse<UserModel>> => {
    try {

        if (userModel._id!) {
            const response = await EnsureUpdateUserOperationAsync(userModel._id!);
            if (response.status !== "OK") {
              return response;
            }
        }

        await mongoDbConnection();
        const updatedUser = await User.findOneAndUpdate({id: userModel._id}, 
            { $set: userModel },
            { new: true } );

            const {updatedAt, password, ...user} = updatedUser._doc

        if (user) {
            return {
              status: "OK",
              response: {...user, _id: user._id.toString()},
            };
        }

        return {
            status: "ERROR",
            errors: [{ message: `Failed to update the user.` }],
        };

    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
          };
    }
}; 

export const ResetPasswordAsync = async (
    userModel: UserModel
): Promise<ServerActionResponse<UserModel>> => {
    try {

        if (userModel._id!) {
            const response = await EnsureUpdateUserOperationAsync(userModel._id!);
            if (response.status !== "OK") {
              return response;
            }
        }

        await mongoDbConnection();     
        const hashedPassword = await bcrypt.hash(userModel.password!, 10);

        const updatedUser = await User.findOneAndUpdate({id: userModel._id}, 
            { $set: {password: hashedPassword} },
            { new: true } );

            const {updatedAt, password, ...user} = updatedUser._doc

        if (user) {
            return {
              status: "OK",
              response: {...user, _id: user._id.toString()},
            };
        }

        return {
            status: "ERROR",
            errors: [{ message: `Failed to update the user.` }],
        };

    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
          };
    }
};

export const ChangePasswordAsync = async (
    passwordModel: ChangePasswordModel
): Promise<ServerActionResponse<UserModel>> => {
    try {
        const response = await EnsureUpdateUserOperationAsync(passwordModel.userId!);
        if (response.status !== "OK") {
            return response;
        }
        
        await mongoDbConnection();

        const verifyResponse = await verifyPassword(response.response, passwordModel.oldPassword!)
        if(verifyResponse.status === "ERROR"){
            return verifyResponse;
        }
        
        const hashedPassword = await bcrypt.hash(passwordModel.password!, 10);
        const authUser = response.response;

        const toUpdate = {
            ...authUser,
            password: hashedPassword,
            shouldChangePassword: false,
        }

        const updatedUser = await User.findOneAndUpdate({id: passwordModel.userId}, 
            { $set: toUpdate },
            { new: true } );

            const {updatedAt, password, ...user} = updatedUser._doc

        if (user) {
            return {
              status: "OK",
              response: {...user, _id: user._id.toString()},
            };
        }

        return {
            status: "ERROR",
            errors: [{ message: `Failed to update the user password.` }],
        };

    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
          };
    }
};

const GetUserByIdAsync = async(
    userId: string
): Promise<ServerActionResponse<UserModel>>=>{
    try {
        await mongoDbConnection();
        const resource = await User.findOne({id: userId});

        if (!resource) {
            return {
              status: "NOT_FOUND",
              errors: [{ message: `User not found` }],
            };
        }

        const {updatedAt, ...user} = resource._doc

        return {
            status: "OK",
            response: {...user, _id: user._id.toString()},
        };
        
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const GetUserByEmailAsync = async(
    email: string
): Promise<ServerActionResponse<UserModel>>=>{
    try {
        await mongoDbConnection();
        const resource = await User.findOne({email});

        if (!resource) {
            return {
              status: "NOT_FOUND",
              errors: [{ message: `User not found` }],
            };
        }

        const {updatedAt, password, ...user} = resource._doc

        return {
            status: "OK",
            response: {...user, _id: user._id.toString()},
        };
        
    } catch (error) {
        return {
            status: "ERROR",
            errors: [{ message: `${error}` }],
        };
    }
}

export const EnsureUpdateUserOperationAsync = async (
    userId: string
  ): Promise<ServerActionResponse<UserModel>> => {
    const response = await GetUserByIdAsync(userId);
    const currentUser = await getCurrentUser();
  
    if (response.status === "OK") {
      if (currentUser.isAdmin || response.response._id === currentUser.id) {
        return response;
      }else{
        return {
            status: "ERROR",
            errors: [{ message: `You are not allow to proceed this task.` }],
        };
      }
    }
  
    return response;
};

export const EnsureRegisterUserOperation = async (
    email: string
  ): Promise<ServerActionResponse<string>> => {
    const response = await GetUserByEmailAsync(email);
    const currentUser = await getCurrentUser();

    if (response.status === "OK") {
        return {
            status: "ERROR",
            errors: [{ message: `Email already in use.` }],
        };
    }
  
    if (response.status === "NOT_FOUND") {
      if (currentUser.isAdmin) {
        return {
            status: "OK",
            response: "User can be added."
        };
      }else{
        return {
            status: "ERROR",
            errors: [{ message: `You are not allow to proceed this task.` }],
        };
      }
    }
  
    return response;
};

const verifyPassword = async(
    user: UserModel, 
    password: string
): Promise<ServerActionResponse<boolean>>=>{

    const currentDate = new Date();
    if (user.lastFailedAttempts! >= MAX_FAILED_LOGIN && 
        (currentDate.getTime() - user.lastAttempt!.getTime()) <= LOCKOUT_DURATION * 60 * 1000) {
        const lockoutEnd = new Date(user.lastAttempt!.getTime() + LOCKOUT_DURATION * 60 * 1000);
        if (currentDate.getTime() <= lockoutEnd.getTime()) {
            const timeRemaining = lockoutEnd.getTime() - currentDate.getTime();
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);

            return {
                status: "ERROR",
                errors: [{ message: `Locked out for ${minutes} min ${seconds}s.` }],
            };
        }
    }

    await mongoDbConnection();
    const isPasswordCorrect = await bcrypt.compare(password,user.password!);
    if(isPasswordCorrect){
        user.lastFailedAttempts! = 0;
        user.totalFailedAttempts! = 0;
        user.lastAttempt = currentDate;

        await User.findOneAndUpdate({id: user._id},
            { $set: user },{ new: true } );
        return {
            status: "OK",
            response: true
        };
    }else{
        user.lastFailedAttempts! +=1;
        user.totalFailedAttempts! += 1;
        user.lastAttempt = currentDate;

        await User.findOneAndUpdate({id: user._id},
            { $set: user },{ new: true } );

        return {
            status: "ERROR",
            errors: [{ message: "Invalid Email or Password." }],
        };
    }
}

export const EnsureUserIsAuthenticated = async (): Promise<
  ServerActionResponse<UserBaseModel>
> => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      status: "ERROR",
      errors: [{ message: `You are not authenticated.` }],
    };
  }

  return {
    status: "OK",
    response: currentUser,
  };
};

export const UpdateUserSettings = async (props: {
    user: UserModel;
  }) => {
    await UpdateUserAsync({...props.user});
  
    RevalidateCache({
      page: "dashboard",
      type: "layout",
    });
};
