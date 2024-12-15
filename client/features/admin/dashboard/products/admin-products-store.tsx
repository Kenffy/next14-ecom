import { RevalidateCache } from "@/features/common/navigation-helpers";
import { ServerActionError, ServerActionResponse, zodErrorsToServerActionErrors } from "@/features/common/server-action-response";
import { showError, showSuccess } from "@/features/globals/global-message-store";
import { ProductSchema } from "./models";
import { CategoryModel, FileModel, ProductAttribute, ProductModel, ProductType } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";
import { CreateProductAsync, UpdateProductAsync, UpdateProductDefaultImageAsync, UploadFileAsync } from "./product-service";
import { uniqueId } from "@/features/common/util";

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
    sku: "",
    name: "Test product title 1",
    slug: "",
    brand: "",
    description: "Test product desc 1",
    defaultImage: "",
    type: "simple",
    images: [],
    tags: [],
    categories: [],
    attributes: [],
    dimensions: { length: 0, width: 0, height: 0 },
    inventory: {
      quantity: 1,
      status: "low_stock"
    },
    price: 0,
    discount: 0
  }

  public errors: string[] = [];
  public product: ProductModel = { ...this.defaultModel };
  public products: Array<ProductModel> = [];
  public productType: ProductType = "simple";
  public productCategories: Array<string> = [];
  public categories: Array<CategoryModel> = [];
  public attributes: Array<ProductAttribute> = [];
  public uploads: FormData = new FormData();
  public uploadSize: number = 0;
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

  private createDefaultAttribute(){
    const attribute: ProductAttribute = {
      id: uniqueId(),
      name: "",
      values: []
    }
    return attribute;
  }

  public addAttribute() {
    this.attributes.push({
      ...this.createDefaultAttribute()
    });
  }

  public removeAttribute(id: string) {
    this.attributes = this.attributes.filter(
      (a) => a.id !== id
    );
  }

  public updateAttributeName(id: string, value: string) {
    this.attributes = this.attributes.map(a => a.id === id? {...a, name: value} : a);
  }

  public updateAttributeValues(id: string, values: Array<string>) {
    this.attributes = this.attributes.map(a => a.id === id? {...a, values} : a);
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
    this.productType = product.type;
    this.productCategories = product.categories;
    this.attributes = product.attributes;
    this.isOpened = true;
  }

  public updateUploads(images: FormData, size: number) {
    this.uploads = images;
    this.uploadSize = size;
  }

  public resetInputs() {
    this.uploads = new FormData();
    this.uploadSize = 0;
    this.product = { ...this.defaultModel };
  }

  public updateProductType(value: string) {
    this.productType = value as ProductType;
  }

  public updateProductCategories(value: Array<string>) {
    this.productCategories = [...value];
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public cancelAddOrEditProduct() {
    this.isOpened = false;
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

  const uploadFormData = adminProductStore.uploads;
  const uploadSize = adminProductStore.uploadSize;
  adminProductStore.resetInputs();

  const model = {
    ...FormDataToProductModel(formData),
    type: adminProductStore.productType,
    attributes: [...adminProductStore.attributes],
    categories: [...adminProductStore.productCategories],
  };

  // schema validation
  const validatedFields = validateProductSchema(model);
  if (validatedFields.status === "ERROR") {
    return validatedFields
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
    if(model._id === ""){
      model.defaultImage = fileUrls[0].url; 
    }
    model.images = [...fileUrls];
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
  const quantity = parseInt(formData.get("quantity") as string);
  const status = "in_stock"; //getProductStatusByQuantity(quantity);
  return {
    _id: formData.get("id") as string,
    sku: formData.get("sku") as string,
    name: formData.get("name") as string,
    brand: formData.get("brand") as string,
    type: "simple",
    description: formData.get("desc") as string,
    material: formData.get("material") as string,
    price: parseFloat(price),
    discount: parseFloat(discount),
    inventory: {
      quantity,
      status
    },
    dimensions: {
      height: parseInt(formData.get("height") as string),
      width: parseInt(formData.get("width") as string),
      length: parseInt(formData.get("length") as string),
    },
    personalisable: formData.get("personalisable") === "on" ? true : false,
    attributes: [],
    categories: []
  };
};

const validateProductSchema = (model: ProductModel): ServerActionResponse => {
  const validatedFields = ProductSchema.safeParse(model);
  console.log(validatedFields)
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