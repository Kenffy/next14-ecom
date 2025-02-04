"use server";
import "server-only";

import { ServerActionResponse } from "@/features/common/server-action-response";
import mongoDbConnection from "@/features/common/services/mongo";
import {
  BaseProductModel,
  FileModel,
  PaginationResponse,
  ProductAttribute,
  ProductFilter,
  ProductModel,
  UploadResponse,
} from "@/schemas/models";
import { GenerateSlug } from "@/features/common/util";
import { getCurrentUser } from "@/features/auth-page/helpers";
import { RevalidateCache } from "@/features/common/navigation-helpers";
import { Product } from "@/schemas/product";

const CLOUDIFY_API_URL = process.env.CLOUDIFY_API_URL;
const CLOUDIFY_API_KEY = process.env.CLOUDIFY_API_KEY;

type ProductFilterProps = {
  deleted?: boolean;
  categories?: string[];
};

export const CreateProductAsync = async (
  model: ProductModel
): Promise<ServerActionResponse<string>> => {
  try {
    const response = await EnsureCreateOperationAsync();
    if (response.status !== "OK") {
      return response;
    }

    await mongoDbConnection();
    const { _id, ...modelToSave } = model;
    const productModel = new Product({
      ...modelToSave,
      //slug: GenerateSlug(modelToSave.name),
    });
    const resource = await productModel.save();

    if (resource && resource._doc) {
      return {
        status: "OK",
        response: "Product successfully added.",
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Error: Couldn't add the product.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetAllActiveProductsAsync = async (): Promise<
  ServerActionResponse<Array<ProductModel>>
> => {
  try {
    await mongoDbConnection();
    const resources = await Product.find({ deleted: false });
    const recordProducts = resources.map<ProductModel>((prod) => {
      const { updatedAt, ...product } = prod._doc;
      return { ...product, _id: product._id.toString() };
    });
    return {
      status: "OK",
      response: recordProducts,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetAllProductsAsync = async (
  filters?: ProductFilterProps
): Promise<ServerActionResponse<Array<ProductModel>>> => {
  try {
    await mongoDbConnection();
    const resources = await Product.find({ ...filters });
    const recordProducts =
      resources.length > 0
        ? resources.map((prod) => {
            const product = performProductMapping(prod._doc as ProductModel);
            return product;
          })
        : [];
    return {
      status: "OK",
      response: recordProducts,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

const performProductMapping = (product: ProductModel) => {
  const { updatedAt, ...others } = product;
  const attributes: Array<ProductAttribute> =
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

  const mappedProduct: ProductModel = {
    ...others,
    _id: others._id?.toString(),
    attributes,
    images,
  };

  return mappedProduct;
};

export const GetBaseFeaturedProductsAsync = async (
  filters?: ProductFilterProps
): Promise<ServerActionResponse<Array<BaseProductModel>>> => {
  try {
    await mongoDbConnection();
    const attributes = "slug name price discount reviews defaultImage";
    const resources = await Product.find({ ...filters }, attributes).exec();

    const recordProducts = resources.map<BaseProductModel>((prod) => {
      const { _id, ...product } = prod._doc;
      return product;
    });
    return {
      status: "OK",
      response: recordProducts,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetBaseProductsAsync = async (
  filters: ProductFilter,
  page: number = 1,
  limit: number = 10
): Promise<ServerActionResponse<PaginationResponse<BaseProductModel>>> => {
  try {
    await mongoDbConnection();
    // Building the query object dynamically
    const query: any = { deleted: false };
    const attributes = "slug name price discount reviews defaultImage";

    // if (filters.category && filters.category.toLocaleLowerCase() !== "all")
    //   query.category = filters.category;
    if (filters.category && filters.category.toLocaleLowerCase() !== "all") query.categories = { $in: [filters.category] }; // Supports multiple categories
    if (filters.minPrice !== undefined && filters.minPrice > 0)
      query.price = { ...query.price, $gte: filters.minPrice };
    if (filters.maxPrice !== undefined && filters.maxPrice > 0)
      query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.search) query.name = { $regex: filters.search, $options: "i" }; // Case-insensitive search
    console.log("query: ", query);

    // Sorting logic
    const sortOptions: any = {};
    switch (filters.sort) {
      case "asc":
        sortOptions.price = 1; // Lowest Price First
        break;
      case "desc":
        sortOptions.price = -1; // Highest Price First
        break;
      case "recent":
        sortOptions.createdAt = -1; // Most Recent First
        break;
      // case "relevancy":
      //   if (search) {
      //     sortOptions.score = { $meta: "textScore" }; // Text search relevance (if implemented)
      //   }
      //   break;
      default:
        break;
    }

    // Pagination calculations
    const skip = (page - 1) * limit;

    //const resources = await Product.find({ ...filters }, attributes).exec();
    // Fetching filtered and paginated products
    const resources = await Product.find(query, attributes)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRecords = await Product.countDocuments(query); // For pagination metadata

    const recordProducts = resources.map<BaseProductModel>((prod: any) => {
      return { ...prod, _id: prod._id.toString() };
    });
    
    return {
      status: "OK",
      response: {
        data: recordProducts,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        limit,
      },
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateProductAsync = async (
  productModel: ProductModel
): Promise<ServerActionResponse<string>> => {
  try {
    if (productModel._id!) {
      const response = await EnsureUpdateOperationAsync(productModel._id!);
      if (response.status !== "OK") {
        return response;
      }
    }

    await mongoDbConnection();
    productModel.slug = GenerateSlug(productModel.name);
    const updatedProduct = await Product.findByIdAndUpdate(
      productModel._id,
      { $set: productModel },
      { new: true }
    );

    if (updatedProduct && updatedProduct._doc) {
      return {
        status: "OK",
        response: "Product successfully updated.",
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to update the product.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UpdateProductDefaultImageAsync = async (
  productId: string,
  imageUrl: string
): Promise<ServerActionResponse<string>> => {
  try {
    const response = await EnsureUpdateOperationAsync(productId!);
    if (response.status !== "OK") {
      return response;
    }

    const currentProduct = response.response;
    currentProduct.defaultImage = imageUrl;
    await mongoDbConnection();
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: currentProduct },
      { new: true }
    );

    if (updatedProduct) {
      return {
        status: "OK",
        response: "Product default image updated.",
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to set the product default image.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const DeleteProductAsync = async (
  productModel: ProductModel
): Promise<ServerActionResponse<string>> => {
  try {
    if (productModel._id) {
      const response = await EnsureUpdateOperationAsync(productModel._id);
      if (response.status !== "OK") {
        return response;
      }
    }

    await mongoDbConnection();

    const updatedProduct = await Product.findByIdAndUpdate(
      productModel._id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    const { updatedAt, ...product } = updatedProduct._doc;

    if (product) {
      return {
        status: "OK",
        response: { ...product, _id: product._id.toString() },
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to delete the product.` }],
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const GetProductBySlugAsync = async (
  slug: string
): Promise<ServerActionResponse<ProductModel>> => {
  try {
    await mongoDbConnection();
    const resource = await Product.findOne({ slug });

    if (!resource) {
      return {
        status: "NOT_FOUND",
        errors: [{ message: `Product not found` }],
      };
    }

    const product = performProductMapping(resource._doc as ProductModel);

    return {
      status: "OK",
      response: product,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

const GetProductByIdAsync = async (
  productId: string
): Promise<ServerActionResponse<ProductModel>> => {
  try {
    await mongoDbConnection();
    const resource = await Product.findById(productId);

    if (!resource) {
      return {
        status: "NOT_FOUND",
        errors: [{ message: `Product not found` }],
      };
    }

    const product = performProductMapping(resource._doc as ProductModel);

    return {
      status: "OK",
      response: product,
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
): Promise<ServerActionResponse<ProductModel>> => {
  const response = await GetProductByIdAsync(productId);
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

export const UpdateProductSettings = async (props: {
  product: ProductModel;
}) => {
  await UpdateProductAsync({ ...props.product });

  RevalidateCache({
    page: "dashboard",
    type: "layout",
  });
};

// upload files
export const UploadHealthCheckAsync = async (): Promise<
  ServerActionResponse<string>
> => {
  try {
    const response = await fetch(`${CLOUDIFY_API_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const uploadData = await response.json();
    if (!uploadData) {
      return {
        status: "ERROR",
        errors: [{ message: `Upload service not available.` }],
      };
    }
    return {
      status: "OK",
      response: uploadData.message,
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const UploadFileAsync = async (
  formData: FormData,
  location?: string
): Promise<ServerActionResponse<UploadResponse>> => {
  try {
    const path = location ? location : "";
    const response = await fetch(`${CLOUDIFY_API_URL}/api/upload?dir=${path}`, {
      method: "POST",
      body: formData,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${CLOUDIFY_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const uploadData = await response.json();
    if (!uploadData) {
      return {
        status: "ERROR",
        errors: [{ message: `Something went wrong while uploading the file.` }],
      };
    }
    return {
      status: "OK",
      response: {
        message: uploadData.message,
        data: {
          name: uploadData.fileName,
          location: uploadData.location,
          url: uploadData.url,
        },
      },
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};

export const DeleteFileAsync = async (
  filaName: string,
  location?: string
): Promise<ServerActionResponse<string>> => {
  try {
    const path = location ? location : "";
    const response = await fetch(
      `${CLOUDIFY_API_URL}/api/delete/${filaName}?dir=${path}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${CLOUDIFY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return {
      status: "OK",
      response: "File successfully deleted.",
    };
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    };
  }
};
