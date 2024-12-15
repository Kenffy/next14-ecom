"use server";
import "server-only";

import { ServerActionResponse } from "@/features/common/server-action-response";
import { CategoryModel } from "@/schemas/models";
import mongoDbConnection from "@/features/common/services/mongo";
import { getCurrentUser } from "@/features/auth-page/helpers";
import { Category } from "@/schemas/category";

export const CreateCategoryAsync = async (
  model: CategoryModel
): Promise<ServerActionResponse<CategoryModel>> => {
  try {
    await mongoDbConnection();
    const modelToSave = new Category({
      name: model.name,
      desc: model.desc,
    });

    const resource = await modelToSave.save();
    const { updatedAt, ...category } = resource._doc;

    if (category) {
      return {
        status: "OK",
        response: { ...category, _id: category._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Could not create the category: ${model.name}` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetCategoriesAsync = async (): Promise<
  ServerActionResponse<Array<CategoryModel>>
> => {
  try {
    await mongoDbConnection();
    const resources = await Category.find();
    const categories = resources.map<CategoryModel>((cat) => {
      const { updatedAt, ...category } = cat._doc;
      return { ...category, _id: category._id.toString() };
    });

    return {
      status: "OK",
      response: categories,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetCategoryByIdAsync = async (
  id: string
): Promise<ServerActionResponse<CategoryModel>> => {
  try {
    await mongoDbConnection();
    const resource = await Category.findById(id);

    if (!resource) {
      return {
        status: "NOT_FOUND",
        errors: [{ message: `Category not found` }],
      };
    }

    const { updatedAt, ...category } = resource._doc;

    return {
      status: "OK",
      response: { ...category, _id: category._id.toString() },
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateCategoryAsync = async (
  categoryModel: CategoryModel
): Promise<ServerActionResponse<CategoryModel>> => {
  try {
    if (categoryModel._id!) {
      const response = await EnsureCategoryOperation(categoryModel._id!);
      if (response.status !== "OK") {
        return response;
      }
    }

    await mongoDbConnection();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryModel._id,
      { $set: categoryModel },
      { new: true }
    );

    const { updatedAt, ...category } = updatedCategory._doc;

    if (category) {
      return {
        status: "OK",
        response: { ...category, _id: category._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [
        { message: `Failed to update the category: ${categoryModel.name}` },
      ],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateCategoryName = async (
  categoryId: string,
  name: string
): Promise<ServerActionResponse<CategoryModel>> => {
  try {
    const response = await EnsureCategoryOperation(categoryId);
    if (response.status !== "OK") {
      return response;
    }

    response.response.name = name;
    return await UpdateCategoryAsync(response.response);
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const DeleteCategoryAsync = async (
  categoryId: string
): Promise<ServerActionResponse<string>> => {
  try {
    const response = await EnsureCategoryOperation(categoryId);
    if (response.status !== "OK") {
      return response;
    }

    await mongoDbConnection();
    await Category.findByIdAndDelete(categoryId);

    return {
      status: "OK",
      response: "Category deleted successfully.",
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const EnsureCategoryOperation = async (
  categoryId: string
): Promise<ServerActionResponse<CategoryModel>> => {
  const response = await GetCategoryByIdAsync(categoryId);
  const currentUser = await getCurrentUser();

  if (response.status === "OK") {
    if (currentUser.isAdmin) {
      return response;
    } else {
      return {
        status: "ERROR",
        errors: [
          { message: `Unauthorized! Only admin can proceed this task.` },
        ],
      };
    }
  }

  return response;
};
