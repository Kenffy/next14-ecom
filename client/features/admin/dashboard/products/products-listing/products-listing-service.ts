"use server";
import "server-only";

import { ServerActionResponse } from "@/features/common/server-action-response";
import mongoDbConnection from "@/features/common/services/mongo";
import { ProductVariant, ProductVariantModel } from "@/schemas/models";
import { getCurrentUser } from "@/features/auth-page/helpers";
import { RevalidateCache } from "@/features/common/navigation-helpers";
import { adminProductListingStore } from "./products-listing-store";
import { GetProductBySlugAsync } from "../product-service";

type ProductVariantFilterProps = {
  isDeleted?: boolean;
  category?: string;
};

export const CreateProductVariantAsync = async (
  model: ProductVariantModel
): Promise<ServerActionResponse<ProductVariantModel>> => {
  try {
    const response = await EnsureCreateOperationAsync();
    if (response.status !== "OK") {
      return response;
    }

    await mongoDbConnection();
    const { _id, ...modelToSave } = model;
    const productVariantModel = new ProductVariant({
      ...modelToSave,
      isDeleted: false,
    });
    const resource = await productVariantModel.save();
    const { updatedAt, ...productVariant } = resource._doc;

    if (productVariant) {
      return {
        status: "OK",
        response: { ...productVariant, _id: productVariant._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Error: Couldn't add the product variant.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetAllVariantsForCurrentProductAsync = async (
  slug: string
): Promise<ServerActionResponse<Array<ProductVariantModel>>> => {
  try {
    await mongoDbConnection();
    const productResponse = await GetProductBySlugAsync(slug);
    if (productResponse.status !== "OK") {
      return productResponse;
    }

    const resources = await ProductVariant.find({
      productId: productResponse.response._id,
      isDeleted: false,
    });
    const recordProductVariants = resources.map<ProductVariantModel>((prod) => {
      const { updatedAt, ...productVariant } = prod._doc;
      return { ...productVariant, _id: productVariant._id.toString() };
    });
    return {
      status: "OK",
      response: recordProductVariants,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetAllProductVariantsAsync = async (
  filters?: ProductVariantFilterProps
): Promise<ServerActionResponse<Array<ProductVariantModel>>> => {
  try {
    await mongoDbConnection();
    const resources = await ProductVariant.find({ ...filters });
    const recordProductVariants = resources.map<ProductVariantModel>((prod) => {
      const { updatedAt, password, ...productVariant } = prod._doc;
      return { ...productVariant, _id: productVariant._id.toString() };
    });
    return {
      status: "OK",
      response: recordProductVariants,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateProductVariantAsync = async (
  productVariantModel: ProductVariantModel
): Promise<ServerActionResponse<ProductVariantModel>> => {
  try {
    if (productVariantModel._id!) {
      const response = await EnsureUpdateOperationAsync(
        productVariantModel._id!
      );
      if (response.status !== "OK") {
        return response;
      }
    }

    await mongoDbConnection();
    const updatedProductVariant = await ProductVariant.findByIdAndUpdate(
      productVariantModel._id,
      { $set: productVariantModel },
      { new: true }
    );

    const { updatedAt, ...productVariant } = updatedProductVariant._doc;

    if (productVariant) {
      return {
        status: "OK",
        response: { ...productVariant, _id: productVariant._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to update the product variant.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const DeleteProductVariantAsync = async (
  productVariantModel: ProductVariantModel
): Promise<ServerActionResponse<string>> => {
  try {
    if (productVariantModel._id) {
      const response = await EnsureUpdateOperationAsync(
        productVariantModel._id
      );
      if (response.status !== "OK") {
        return response;
      }
    }

    await mongoDbConnection();

    const updatedProductVaraint = await ProductVariant.findByIdAndUpdate(
      productVariantModel._id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    const { updatedAt, ...productVaraint } = updatedProductVaraint._doc;

    if (productVaraint) {
      return {
        status: "OK",
        response: { ...productVaraint, _id: productVaraint._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to delete the product variant.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

const GetProductVariantByIdAsync = async (
  productVariantId: string
): Promise<ServerActionResponse<ProductVariantModel>> => {
  try {
    await mongoDbConnection();
    const resource = await ProductVariant.findById(productVariantId);

    if (!resource) {
      return {
        status: "NOT_FOUND",
        errors: [{ message: `Product variant not found` }],
      };
    }

    const { updatedAt, ...productVariant } = resource._doc;

    return {
      status: "OK",
      response: { ...productVariant, _id: productVariant._id.toString() },
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const EnsureUpdateOperationAsync = async (
  productId: string
): Promise<ServerActionResponse<ProductVariantModel>> => {
  const response = await GetProductVariantByIdAsync(productId);
  const currentUser = await getCurrentUser();

  if (response.status === "OK") {
    if (currentUser.isAdmin) {
      return response;
    } else {
      return {
        status: "ERROR",
        errors: [{ message: `You are not allow to proceed this task.` }],
      };
    }
  }

  return response;
};

export const EnsureCreateOperationAsync = async (): Promise<
  ServerActionResponse<boolean>
> => {
  const currentUser = await getCurrentUser();
  if (!currentUser.isAdmin) {
    return {
      status: "ERROR",
      errors: [{ message: `You are not allow to proceed this task.` }],
    };
  }

  return {
    status: "OK",
    response: true,
  };
};

export const UpdateProductVariantSettings = async (props: {
  product: ProductVariantModel;
}) => {
  await UpdateProductVariantAsync({ ...props.product });

  RevalidateCache({
    page: "dashboard",
    params: `products/${adminProductListingStore.product?._id}`,
  });
};
