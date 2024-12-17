"use server";
import "server-only";

import { ServerActionResponse } from "@/features/common/server-action-response";
import mongoDbConnection from "@/features/common/services/mongo";
import { FileModel, VariantAttribute, VariantModel } from "@/schemas/models";
import { getCurrentUser } from "@/features/auth-page/helpers";
import { RevalidateCache } from "@/features/common/navigation-helpers";
import { adminListingStore } from "./products-listing-store";
import { GetProductBySlugAsync } from "../product-service";
import { Variant } from "@/schemas/variant";

type ProductVariantFilterProps = {
  isDeleted?: boolean;
  category?: string;
};

export const CreateProductVariantAsync = async (
  model: VariantModel
): Promise<ServerActionResponse<string>> => {
  try {
    const response = await EnsureCreateOperationAsync();
    if (response.status !== "OK") {
      return response;
    }

    await mongoDbConnection();
    const { _id, ...modelToSave } = model;
    const productVariantModel = new Variant({
      ...modelToSave,
      isDeleted: false,
    });
    const resource = await productVariantModel.save();

    if (resource) {
      return {
        status: "OK",
        response: "Product variant successfully created.",
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
): Promise<ServerActionResponse<Array<VariantModel>>> => {
  try {
    await mongoDbConnection();
    const productResponse = await GetProductBySlugAsync(slug);
    if (productResponse.status !== "OK") {
      return productResponse;
    }

    const resources = await Variant.find({
      productId: productResponse.response._id,
      deleted: false,
    });

    const recordProductVariants = resources.map<VariantModel>((prod) => {
      const variant = performVariantMapping(prod._doc);
      return variant;
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
): Promise<ServerActionResponse<Array<VariantModel>>> => {
  try {
    await mongoDbConnection();
    const resources = await Variant.find({ ...filters });
    const recordProductVariants = resources.map<VariantModel>((prod) => {
      const variant = performVariantMapping(prod._doc);
      return variant;
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

const performVariantMapping = (product: VariantModel) => {
  const { updatedAt, ...others } = product;
  const attributes: Array<VariantAttribute> =
    others?.attributes && others.attributes.length > 0
      ? others.attributes.map((a: any) => {
          const { _id, ...rest } = a._doc;
          return rest;
        })
      : [];
  const images: Array<FileModel> =
    others?.images && others.images.length > 0
      ? others.images.map((a: any) => {
          const { _id, ...rest } = a._doc;
          return rest;
        })
      : [];

  const mappedProduct: VariantModel = {
    ...others,
    _id: others._id?.toString(),
    attributes,
    images,
  };

  return mappedProduct;
};

export const UpdateProductVariantAsync = async (
  productVariantModel: VariantModel
): Promise<ServerActionResponse<string>> => {
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
    const updatedProductVariant = await Variant.findByIdAndUpdate(
      productVariantModel._id,
      { $set: productVariantModel },
      { new: true }
    );

    if (updatedProductVariant) {
      return {
        status: "OK",
        response: "Product variant successfully updated.",
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
  productVariantModel: VariantModel
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

    const updatedProductVaraint = await Variant.findByIdAndUpdate(
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
): Promise<ServerActionResponse<VariantModel>> => {
  try {
    await mongoDbConnection();
    const resource = await Variant.findById(productVariantId);

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
): Promise<ServerActionResponse<VariantModel>> => {
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
  product: VariantModel;
}) => {
  await UpdateProductVariantAsync({ ...props.product });

  RevalidateCache({
    page: "dashboard",
    params: `products/${adminListingStore.product?._id}`,
  });
};
