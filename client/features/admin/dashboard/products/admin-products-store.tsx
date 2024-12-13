import { RevalidateCache } from "@/features/common/navigation-helpers";
import { ServerActionError, ServerActionResponse, zodErrorsToServerActionErrors } from "@/features/common/server-action-response";
import { showSuccess } from "@/features/globals/global-message-store";
import { ProductSchema } from "./models";
import { CategoryModel, ProductModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";
import { CreateProductAsync, UpdateProductAsync } from "./product-service";

interface FormState {
  success: boolean;
  errors: ServerActionError[];
}

class AdminProductState {
  public formState: FormState = {
    success: false,
    errors: [],
  };

  private defaultModel: ProductModel = {
    _id: "",
    name: "Test product title 1",
    slug: "",
    desc: "Test product desc 1",
    defaultImage: "",
    variants: [],
    dimensions: { length: 0, width: 0, height: 0 },
    quantity: 1,
    price: 5,
    discount: 0
  }

  public errors: string[] = [];
  public product: ProductModel = { ...this.defaultModel };
  public products: Array<ProductModel> = [];
  public category: string = "";
  public categories: Array<CategoryModel> = [];
  public isOpened: boolean = false;

  public initAdminProductSession({
    products,
    categories,
  }: {
    products: Array<ProductModel>;
    categories: Array<CategoryModel>;
  }) {
    this.products = products;
    this.categories = categories;
  }

  public addProduct() {
    this.product = {
      ...this.defaultModel,
    };
    this.isOpened = true;
  }

  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updateProduct(product: ProductModel) {
    this.product = {
      ...product
    };
    this.category = product.category!;
    this.isOpened = true;
  }

  public updateCategory(value: string) {
    this.category = value;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public cancelAddOrEditProduct() {
    this.isOpened = false;
  }
};

export const adminProductStore = proxy(new AdminProductState());

export const useAdminProductState = () => {
  return useSnapshot(adminProductStore, { sync: true });
};

export const AddOrUpdateProduct = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<ProductModel>> => {
  adminProductStore.updateErrors([]);

  const model = {
    ...FormDataToProductModel(formData),
    category: adminProductStore.category
  };
  console.log("variant model: ", model)
  // schema validation
  const validatedFields = validateProductSchema(model);
  if (validatedFields.status === "ERROR") {
    return validatedFields
  }

  const response =
    model._id && model._id !== ""
      ? await UpdateProductAsync(model)
      : await CreateProductAsync(model);

  if (response.status === "OK") {
    showSuccess({
      title: model._id !== "" ? "Update Product" : "Add Product",
      description: model._id !== "" ? `Product successfully updated.` : " Product successfully added."
    });
    adminProductStore.updateOpened(false);
    RevalidateCache({
      page: "dashboard",
      params: "products"
    });
  } else {
    adminProductStore.updateErrors(response.errors.map((e) => e.message));
  }
  return response;
};

export const FormDataToProductModel = (
  formData: FormData
): ProductModel => {

  const price = parseFloat(formData.get("price") as string).toFixed(2);
  const discount = parseFloat(formData.get("discount") as string).toFixed(2);
  return {
    _id: formData.get("id") as string,
    name: formData.get("name") as string,
    desc: formData.get("desc") as string,
    material: formData.get("material") as string,
    price: parseFloat(price),
    discount: parseFloat(discount),
    quantity: parseInt(formData.get("quantity") as string),
    dimensions: {
      height: parseInt(formData.get("height") as string),
      width: parseInt(formData.get("width") as string),
      length: parseInt(formData.get("length") as string),
    },
    personalisable: formData.get("personalisable") === "on" ? true : false,
  };
};

const validateProductSchema = (model: ProductModel): ServerActionResponse => {
  const validatedFields = ProductSchema.safeParse(model);
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