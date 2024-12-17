import { RevalidateCache } from "@/features/common/navigation-helpers";
import {
  ServerActionError,
  ServerActionResponse,
  zodErrorsToServerActionErrors,
} from "@/features/common/server-action-response";
import { showError, showSuccess } from "@/features/globals/global-message-store";
import { CategoryModel, FileModel, ProductModel, VariantAttribute, VariantModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";
import {
  CreateProductVariantAsync,
  UpdateProductVariantAsync,
} from "./products-listing-service";
import { VariantSchema } from "@/features/admin/dashboard/products/models";
import { UpdateProductDefaultImageAsync, UploadFileAsync } from "../product-service";

interface FormState {
  success: boolean;
  errors: ServerActionError[];
}

class AdminListingState {
  public formState: FormState = {
    success: false,
    errors: [],
  };

  private defaultModel: VariantModel = {
    _id: "",
    sku: "",
    productId: "",
    attributes: [],
    images: [],
    inventory: {
      quantity: 1,
      status: "low_stock"
    },
    price: 0,
    discount: 0,
  };

  public errors: string[] = [];
  public product: ProductModel | undefined;
  public productVariant: VariantModel = { ...this.defaultModel };
  public uploads: FormData = new FormData();
  public uploadSize: number = 0;

  public isOpened: boolean = false;

  public productVariants: Array<VariantModel> = [];
  public categories: Array<CategoryModel> = [];
  public variantAttributes: Array<VariantAttribute> = [];

  public initAdminListingSession({
    product,
    productVariants,
    categories
  }: {
    product: ProductModel;
    productVariants: Array<VariantModel>;
    categories: Array<CategoryModel> ;
  }) {
    this.product = product;
    this.productVariant.productId = product._id as string;
    this.productVariants = productVariants;
    this.categories = categories;
    if(product.type === "variable" && product?.attributes && product.attributes.length > 0){
      this.variantAttributes = product.attributes.map(a => {
        return {
          name: a.name,
          value: ""
        }
      }) 
    }
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

  public updateProductVariant(productVariant: VariantModel) {
    this.productVariant = {
      ...productVariant,
    };
    this.isOpened = true;
  }

  public updateVariantAttributeValues(name: string, value: string) {
    this.variantAttributes = this.variantAttributes.map(a => a.name === name? {...a, value: value} : a);
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

export const adminListingStore = proxy(new AdminListingState());

export const useAdminListingState = () => {
  return useSnapshot(adminListingStore, { sync: true });
};

export const AddOrUpdateProductVariant = async (
  previous: any,
  formData: FormData
): Promise<ServerActionResponse<string>> => {
  adminListingStore.updateErrors([]);

  const uploadFormData = adminListingStore.uploads;
  const uploadSize = adminListingStore.uploadSize;
  adminListingStore.resetInputs();

  const model: VariantModel = {
    ...FormDataToVariantModel(formData),
    productId: adminListingStore.product?._id as string,
    attributes: adminListingStore.variantAttributes
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
    adminListingStore.updateOpened(false);
    RevalidateCache({
      page: "dashboard",
      params: `products/${adminListingStore.product?._id}`,
    });
  } else {
    adminListingStore.updateErrors(
      response.errors.map((e) => e.message)
    );
  }
  return response;
};

export const FormDataToVariantModel = (
  formData: FormData
): VariantModel => {
  const price = parseFloat(formData.get("price") as string).toFixed(2);
  const discount = parseFloat(formData.get("discount") as string).toFixed(2);
  const quantity = parseInt(formData.get("quantity") as string);
  const status = "in_stock"; //getProductStatusByQuantity(quantity);
  return {
    _id: formData.get("id") as string,
    sku: formData.get("sku") as string,
    productId: formData.get("productId") as string,
    attributes: [],
    price: parseFloat(price),
    discount: parseFloat(discount),
    inventory: {
      quantity,
      status,
    },
    images: [],
  };
};

const validateProductVariantSchema = (
  model: VariantModel
): ServerActionResponse => {
  const validatedFields = VariantSchema.safeParse(model);
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
