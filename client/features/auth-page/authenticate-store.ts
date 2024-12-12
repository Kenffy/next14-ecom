import { proxy, useSnapshot } from "valtio";
import { ServerActionError, ServerActionResponse, zodErrorsToServerActionErrors } from "../common/server-action-response";
import { RedirectToPage, RevalidateCache } from "../common/navigation-helpers";
import { showSuccess } from "../globals/global-message-store";
import { signIn } from "next-auth/react";
import { UserModel } from "@/schemas/models";
import { ChangePasswordModel, ChangePasswordSchema, RegisterUserModel, RegisterUserSchema, ResetPasswordModel, ResetPasswordSchema, UpdateUserModel, UpdateUserSchema } from "../common/models";
import { ChangePasswordAsync, RegisterAsync, ResetPasswordAsync, UpdateUserAsync } from "./auth-service";


interface FormState {
  success: boolean;
  errors: ServerActionError[];
}

class AuthenticateState {
  public formState: FormState = {
    success: false,
    errors: [],
  };

  private defaultModel: UserModel = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    isAdmin: false
  }

  public errors: string[] = [];
  public user: UserModel = { ...this.defaultModel };
  public isOpened: boolean = false;
  public isPasswordChange: boolean = false;
  public role = "user";
  public expirationDate: Date | undefined = undefined;

  public newUser() {
    this.user = {
      ...this.defaultModel,
    };
    this.isOpened = true;
  }
  
  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updatePasswordChange(value: boolean) {
    this.isPasswordChange = value;
  }

  public updateUser(user: UserModel) {
    this.user = {
        ...user,
    };
    this.role = user.isAdmin ? "admin": "user";
    this.isOpened = true;
  }

  public updatePassword(user: UserModel) {
    this.user = {
        ...user,
    };
    this.role = user.isAdmin ? "admin": "user";
    this.isPasswordChange = true;
  }

  public updateRole(value: string) {
    this.role = value;
  }

  public updateExpirationDate(value: Date) {
    this.expirationDate = value;
  }

  public updateErrors(errors: string[]) {
      this.errors = errors;
  }
}

export const authenticateStore = proxy(new AuthenticateState());

export const useAuthenticateState = () => {
  return useSnapshot(authenticateStore, {
    sync: true,
  });
};

export const RegisterUser = async (
    previous: any,
    formData: FormData
  ): Promise<ServerActionResponse<UserModel>> => {
    authenticateStore.updateErrors([]);

    const registerModel : RegisterUserModel = {
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    // schema validation
    const validatedFields = validateSchema(registerModel, RegisterUserSchema);
    if(validatedFields.status === "ERROR"){
      return validatedFields
    }

    const response = await RegisterAsync({
        email: registerModel.email,
        username: registerModel.username,
        password: registerModel.password,
        isAdmin: false
    });
  
    if (response.status === "OK") {
      showSuccess({
        title: "User Registration",
        description: " User registration successfully."
      });
      authenticateStore.updateOpened(false);
      RedirectToPage("login");
    } else {
        authenticateStore.updateErrors(response.errors.map((e) => e.message));
    }
    return response;
};

export const UpdateUser = async (
    previous: any,
    formData: FormData
  ): Promise<ServerActionResponse<UserModel>> => {
    authenticateStore.updateErrors([]);

    const updateModel: UpdateUserModel = {
        _id: formData.get("id") as string,
        email: formData.get("email") as string,
        username: formData.get("username") as string,
        lastName: formData.get("lastName") as string,
        firstName: formData.get("firstName") as string
    }

    // schema validation
    const validatedFields = UpdateUserSchema.safeParse(updateModel);
    if (!validatedFields.success) {
        return {
        status: "ERROR",
        errors: zodErrorsToServerActionErrors(validatedFields.error.errors),
        };
    }

    const response = await UpdateUserAsync({...updateModel});
  
    if (response.status === "OK") {
      showSuccess({
        title: "Update User Informations",
        description: "User successfully updated."
      });
      authenticateStore.updateOpened(false);
      RevalidateCache({
        page: "dashboard",
      });
    } else {
        authenticateStore.updateErrors(response.errors.map((e) => e.message));
    }
    return response;
};

export const ResetUserPassword = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<UserModel>> => {
  authenticateStore.updateErrors([]);

  const resetPasswordModel : ResetPasswordModel = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  // schema validation
  const validatedFields = validateSchema(resetPasswordModel, ResetPasswordSchema);
  if(validatedFields.status === "ERROR"){
    return validatedFields
  }

  const response = await ResetPasswordAsync({
    ...resetPasswordModel,
    _id: formData.get("id") as string,
    email: formData.get("email") as string,
  });

  if (response.status === "OK") {
    showSuccess({
      title: "Reset User Password",
      description: "Password successfully updated."
    });
    authenticateStore.updatePasswordChange(false);
    RevalidateCache({
      page: "dashboard",
    });
  } else {
      authenticateStore.updateErrors(response.errors.map((e) => e.message));
  }
  return response;
};

export const ChangeUserPassword = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<UserModel>> => {

  const changePasswordModel : ChangePasswordModel = {
    userId: formData.get("userId") as string,
    oldPassword: formData.get("oldPassword") as string,
    password: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  // schema validation
  const validatedFields = validateSchema(changePasswordModel, ResetPasswordSchema);
  if(validatedFields.status === "ERROR"){
    return validatedFields
  }

  const response = await ChangePasswordAsync({
    ...changePasswordModel
  });
  if (response.status === "OK") {
    showSuccess({
      title: "Reset User Password",
      description: "Password successfully updated."
    });
    signIn("credentials", {
      email: response.response.email, 
      password: changePasswordModel.password
    });
  } else {
      authenticateStore.updateErrors(response.errors.map((e) => e.message));
  }
  return response;

}

export const validateSchema = (
  model: RegisterUserModel | ChangePasswordModel | ResetPasswordModel, 
  schema: typeof RegisterUserSchema | typeof ChangePasswordSchema | typeof ResetPasswordSchema
): ServerActionResponse => {
  const validatedFields = schema.safeParse(model);
  if (!validatedFields.success) {
    return {
      status: "ERROR",
      errors: zodErrorsToServerActionErrors(validatedFields.error.errors),
    };
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{7,}$/;

  if (!passwordPattern.test(model.password!)) {
    return {
      status: "ERROR",
      errors: [
          {message: "Password must be at least 7 characters long, contain an uppercase letter, a number, and a special character."}
      ]
    }
  }

  return {
      status: "OK",
      response: model,
  };
};