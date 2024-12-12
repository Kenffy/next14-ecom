import { RevalidateCache } from "@/features/common/navigation-helpers";
import {
  ServerActionError,
  ServerActionResponse,
  zodErrorsToServerActionErrors,
} from "@/features/common/server-action-response";
import { showError, showSuccess } from "@/features/globals/global-message-store";
import { FileModel, ProductModel, ProductVariantModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";
import {
  CreateProductVariantAsync,
  UpdateProductVariantAsync,
} from "./products-listing-service";
import { ProductVariantSchema } from "@/features/admin/dashboard/products/models";
import { UpdateProductDefaultImageAsync, UploadFileAsync } from "../product-service";

interface FormState {
  success: boolean;
  errors: ServerActionError[];
}

class AdminProductListingState {
  public formState: FormState = {
    success: false,
    errors: [],
  };

  private defaultModel: ProductVariantModel = {
    _id: "",
    productId: "",
    color: "",
    desc: "",
    size: "",
    images: [],
    quantity: 0,
    price: 0,
    discount: 0,
  };

  public errors: string[] = [];
  public product: ProductModel | undefined;
  public productVariant: ProductVariantModel = { ...this.defaultModel };
  public uploads: FormData = new FormData();
  public uploadSize: number = 0;

  public isOpened: boolean = false;

  public productVariants: Array<ProductVariantModel> = [];

  public initAdminProductVariantSession({
    product,
    productVariants,
  }: {
    product: ProductModel;
    productVariants: Array<ProductVariantModel>;
  }) {
    this.product = product;
    this.productVariant.productId = product._id as string;
    this.productVariants = productVariants;
  }

  public addProductVariant() {
    this.productVariant = {
      ...this.defaultModel,
    };
    this.isOpened = true;
  }

  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updateProductVariant(productVariant: ProductVariantModel) {
    this.productVariant = {
      ...productVariant,
    };
    this.isOpened = true;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public cancelAddOrEditProduct() {
    this.isOpened = false;
  }

  public updateUploads(images: FormData, size: number) {
    this.uploads = images;
    this.uploadSize = size;
  }

  public resetInputs() {
    this.uploads = new FormData();
    this.uploadSize = 0;
    this.productVariant = { ...this.defaultModel };
  }

  public async setProductDefaultImage(imageUrl: string) {
    if (this.product && imageUrl) {
      const response = await UpdateProductDefaultImageAsync(this.product._id!, imageUrl);
      if (response.status === "OK") {
        showSuccess({
          title: "Set Product default image.",
          description: "Default image successfully saved."
        })
      } else {
        showError("Something went wrong while saving the product default image.")
      }
    }
  }
}

export const adminProductListingStore = proxy(new AdminProductListingState());

export const useAdminProductListingState = () => {
  return useSnapshot(adminProductListingStore, { sync: true });
};

export const AddOrUpdateProductVariant = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<ProductVariantModel>> => {
  adminProductListingStore.updateErrors([]);

  const uploadFormData = adminProductListingStore.uploads;
  const uploadSize = adminProductListingStore.uploadSize;
  adminProductListingStore.resetInputs();

  const model = {
    ...FormDataToProductVariantModel(formData),
  };
  // schema validation
  const validatedFields = validateProductVariantSchema(model);
  if (validatedFields.status === "ERROR") {
    return validatedFields;
  }

  // upload images
  const fileUrls: FileModel[] = [];
  for (let i = 0; i < uploadSize; i++) {
    const file: File | null = uploadFormData.get(
      `file_${i}`
    ) as unknown as File;
    const formData = new FormData();
    formData.append("file", file);
    const uploadResponse = await UploadFileAsync(formData, "products");
    if (uploadResponse.status === "OK") {
      fileUrls.push(uploadResponse.response.data);
    }
  }

  if (fileUrls.length > 0) {
    model.images = [...fileUrls];
  }

  const response =
    model._id && model._id !== ""
      ? await UpdateProductVariantAsync(model)
      : await CreateProductVariantAsync(model);

  if (response.status === "OK") {
    showSuccess({
      title: model._id !== "" ? "Update Product" : "Add Product",
      description:
        model._id !== ""
          ? `Product successfully updated.`
          : " Product successfully added.",
    });
    adminProductListingStore.updateOpened(false);
    RevalidateCache({
      page: "dashboard",
      params: `products/${adminProductListingStore.product?._id}`,
    });
  } else {
    adminProductListingStore.updateErrors(
      response.errors.map((e) => e.message)
    );
  }
  return response;
};

export const FormDataToProductVariantModel = (
  formData: FormData
): ProductVariantModel => {
  const price = parseFloat(formData.get("price") as string).toFixed(2);
  const discount = parseFloat(formData.get("discount") as string).toFixed(2);
  return {
    _id: formData.get("id") as string,
    color: formData.get("color") as string,
    desc: formData.get("desc") as string,
    size: formData.get("size") as string,
    price: parseFloat(price),
    discount: parseFloat(discount),
    quantity: parseInt(formData.get("quantity") as string),
    productId: adminProductListingStore.product?._id as string,
    images: [],
  };
};

const validateProductVariantSchema = (
  model: ProductVariantModel
): ServerActionResponse => {
  const validatedFields = ProductVariantSchema.safeParse(model);
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
