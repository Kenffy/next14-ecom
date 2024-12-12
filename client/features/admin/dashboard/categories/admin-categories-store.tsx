import { CategoryModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";
import { ServerActionError, ServerActionResponse, zodErrorsToServerActionErrors } from "@/features/common/server-action-response";
import { showError, showSuccess } from "@/features/globals/global-message-store";
import { RevalidateCache } from "@/features/common/navigation-helpers";
import { CreateCategoryAsync, DeleteCategoryAsync, UpdateCategoryAsync } from "./category-service";
import { CategorySchema } from "./models";



interface FormState {
  success: boolean;
  errors: ServerActionError[];
}

class AdminCategoryState {
  public formState: FormState = {
    success: false,
    errors: [],
  };

  public categories: Array<CategoryModel> = [];

  private defaultModel: CategoryModel = {
    _id: "",
    name: "",
    desc: "",
  }

  public errors: string[] = [];
  public category: CategoryModel = { ...this.defaultModel };
  public selectedCategory: string = "";
  public isOpened: boolean = false;

  public initAdminCategorySession({
    categories,
  }: {
    categories: Array<CategoryModel>;
  }) {
    this.categories = categories;
  }

  public addCategory() {
    this.category = {
      ...this.defaultModel,
    };
    this.isOpened = true;
  }

  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updateCategory(category: CategoryModel) {
    this.category = {
      ...category
    };
    this.isOpened = true;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public updateSelectedCategory(value: string) {
    this.selectedCategory = value;
  }
};

export const adminCategoryStore = proxy(new AdminCategoryState());

export const useAdminCategoryState = () => {
  return useSnapshot(adminCategoryStore, {
    sync: true,
  });
};

export const AddOrUpdateCategory = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<CategoryModel>> => {
  adminCategoryStore.updateErrors([]);

  const model = FormDataToCategoryModel(formData);

  // schema validation
  const validatedFields = validateCategorySchema(model);
  if (validatedFields.status === "ERROR") {
    return validatedFields
  }

  const response =
    model._id && model._id !== ""
      ? await UpdateCategoryAsync(model)
      : await CreateCategoryAsync(model);

  if (response.status === "OK") {
    showSuccess({
      title: model._id !== "" ? "Update Category" : "Add Category",
      description: model._id !== "" ? `Category successfully updated.` : " Category successfully added."
    });
    adminCategoryStore.updateOpened(false);
    RevalidateCache({
      page: "dashboard"
    });
  } else {
    adminCategoryStore.updateErrors(response.errors.map((e) => e.message));
  }
  return response;
};

export const DeleteCategory = async (
  categoryId: string
): Promise<ServerActionResponse<string>> => {

  const response = await DeleteCategoryAsync(categoryId);
  if (response.status === "OK") {
    showSuccess({
      title: "Delete category",
      description: response.response
    });
    RevalidateCache({
      page: "dashboard",
    });
  } else {
    showError("Delete category: Something went wrong.");
  }
  return response;
}

export const FormDataToCategoryModel = (
  formData: FormData
): CategoryModel => {

  return {
    _id: formData.get("id") as string,
    name: formData.get("name") as string,
    desc: formData.get("desc") as string,
  };
};

const validateCategorySchema = (model: CategoryModel): ServerActionResponse => {
  const validatedFields = CategorySchema.safeParse(model);
  if (!validatedFields.success) {
    return {
      status: "ERROR",
      errors: zodErrorsToServerActionErrors(validatedFields.error.errors),
    };
  }

  return {
    status: "OK",
    response: model,
  };
};
