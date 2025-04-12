import { DisplayError } from "@/components/ui/error/display-error";
import { GetProductBySlugAsync } from "@/features/admin/dashboard/products/product-service";
import { GetAllVariantsForCurrentProductAsync } from "@/features/admin/dashboard/products/products-listing/products-listing-service";
//import ProductPage from "@/features/client/shop-page/product-page/custom-product-page";
import { ProductPage } from "@/features/client/shop-page/product-page/product-page";

export const metadata = {
  title: "Product Page",
  description: "Product Page Description",
}

interface ProductPageParams{
  params: {slug: string}
}

export default async function Product(props: ProductPageParams) {
  const { slug } = props.params;
  const [productResponse, variantResponse] = await Promise.all([
    GetProductBySlugAsync(slug),
    GetAllVariantsForCurrentProductAsync(slug),
  ]);

  if (productResponse.status !== "OK") {
    return <DisplayError errors={productResponse.errors} />;
  }

  if (variantResponse.status !== "OK") {
    return <DisplayError errors={variantResponse.errors} />;
  }
  return (
    <ProductPage product={productResponse.response} variants={variantResponse.response}/>
    // <ProductPage />
  )
}
