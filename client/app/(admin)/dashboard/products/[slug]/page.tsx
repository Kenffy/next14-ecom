import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { GetProductBySlugAsync, UploadHealthCheckAsync } from "@/features/admin/dashboard/products/product-service";
import { AdminProductListing } from "@/features/admin/dashboard/products/products-listing/products-listing";
import { GetAllVariantsForCurrentProductAsync } from "@/features/admin/dashboard/products/products-listing/products-listing-service";

interface ProductDetailsParams {
    params: {
        slug: string;
    };
}


export default async function ProductDetails(props: ProductDetailsParams) {
    const { slug } = props.params;

    const [productResponse, variantResponse, categoryResponse, uploadService] =
        await Promise.all([
            GetProductBySlugAsync(slug),
            GetAllVariantsForCurrentProductAsync(slug),
            GetCategoriesAsync(),
            UploadHealthCheckAsync()
        ]);

    if (productResponse.status !== "OK") {
        return <DisplayError errors={productResponse.errors} />;
    }

    if (variantResponse.status !== "OK") {
        return <DisplayError errors={variantResponse.errors} />;
    }

    if (categoryResponse.status !== "OK") {
        return <DisplayError errors={categoryResponse.errors} />;
    }

    if (uploadService.status !== "OK") {
        return <DisplayError errors={uploadService.errors} />;
    }

    return (
        <AdminProductListing
            product={productResponse.response}
            productVariants={variantResponse.response} 
            categories={categoryResponse.response}/>
    )

}