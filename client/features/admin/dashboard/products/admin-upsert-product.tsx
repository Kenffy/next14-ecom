import { FC, useState } from "react";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { useFormState, useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddOrUpdateProduct, adminProductStore, useAdminProductState } from "./admin-products-store";
import { Hero } from "@/components/ui/hero";
import { PackagePlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { ProductImagesInput } from "./products-listing/products-images-input";
import { AddAttribute } from "./admin-add-attribute";


interface UpsertProductProps { }

export const UpsertProduct: FC<UpsertProductProps> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { product, categories, productType } = useAdminProductState();

  const categoryOptions = categories.filter(c =>c.name.toLocaleLowerCase() !== "all").map(c => {
    return {
      value: c._id as string, 
      label: c.name as string
    }
  });

  const [formState, formAction] = useFormState(AddOrUpdateProduct, initialState);

  const handleCancel = () => {
    adminProductStore.cancelAddOrEditProduct();
  }

  const handleCategoriesChange = (items: Array<string>) => {
    setSelectedCategories(items);
    adminProductStore.updateProductCategories(items);
  }

  return (
    <div className="flex flex-col gap-4 px-8">
      <Hero
        title={
          <>
            <PackagePlus size={36} strokeWidth={1.5} /> Add Products
          </>
        }
        description={"Manage products."}
      >
      </Hero>
      <div className="container max-w-4xl py-3 mx-auto">
        <form action={formAction} className="flex-1 mt-4 flex flex-col">
          <div className=" flex gap-6 flex-col  flex-1">
            <input type="hidden" name="id" defaultValue={product._id} />
            {formState && formState.status === "OK" ? null : (
              <>
                {formState &&
                  formState.errors.map((error, index) => (
                    <span key={index} className="text-sm text-red-400">
                      {error.message}
                    </span>
                  ))}
              </>
            )}
            <div className="flex-1 gap-2">
              <Label>SKU*</Label>
              <Input
                type="text"
                required
                name="sku"
                placeholder="SKU"
                defaultValue={product.sku}
              />
            </div>
            <div className="flex items-center gap-2">
            <div className="flex-1 gap-2">
              <Label>Name*</Label>
              <Input
                type="text"
                required
                name="name"
                placeholder="Name"
                defaultValue={product.name}
              />
            </div>
              <div className="flex-1 gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  defaultValue={product.brand}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 gap-2">
                <Label>Quantity*</Label>
                <Input
                  type="number"
                  required
                  name="quantity"
                  placeholder="Quantity"
                  defaultValue={product.inventory?.quantity}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Price*</Label>
                <Input
                  type="number"
                  required
                  name="price"
                  placeholder="Price"
                  defaultValue={product.price}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Discount Price</Label>
                <Input
                  type="number"
                  name="discount"
                  placeholder="Discount Price"
                  defaultValue={product.discount}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description*</Label>
              <Textarea
                required
                name="desc"
                placeholder="Description"
                defaultValue={product.description}
              />
            </div>

            {categoryOptions.length > 0 &&
            <div className="grid gap-2">
              <Label>Categories*</Label>
              <MultiSelect
                options={categoryOptions}
                onValueChange={(items)=>handleCategoriesChange(items)}
                defaultValue={selectedCategories}
                placeholder="Select categories"
                variant="default"
                animation={0}
                maxCount={5}
              />
            </div>}

            <div className="flex items-center gap-2">
              <div className="flex-1 gap-2">
                <Label>Length</Label>
                <Input
                  type="number"
                  name="length"
                  placeholder="Length"
                  defaultValue={product.dimensions?.length}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Width</Label>
                <Input
                  type="number"
                  name="width"
                  placeholder="Width"
                  defaultValue={product.dimensions?.width}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  name="height"
                  placeholder="Height"
                  defaultValue={product.dimensions?.height}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 gap-2">
                <Label>Material</Label>
                <Input
                  type="text"
                  name="material"
                  placeholder="Material"
                  defaultValue={product.material}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Weight in Kg</Label>
                <Input
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  defaultValue={product.weight}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Product Type*</Label>
              <small>Selecting "Variable" allows you to create variants of this product.</small>
              <ProductTypeSelect />
            </div>

            {productType === "variable" && 
            <div className="grid gap-2">
              <AddAttribute />
            </div>
            }

            <div className="grid gap-2">
              <div className="flex items-center space-x-2 gap-2">
                <Switch name="personalisable" id="personalisable" defaultChecked={product.personalisable} />
                <Label htmlFor="personalisable">Personalisable</Label>
              </div>
            </div>
            <div className="grid gap-2">
                <Label>Product Images</Label>
                <ProductImagesInput onImagesChange={(formData, size) => adminProductStore.updateUploads(formData, size)}/>
              </div>
            <div className="flex items-center justify-end gap-4">
              <Button type="button"
                onClick={handleCancel}
                variant="secondary">Cancel</Button>
              <Submit />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Submit() {
  const status = useFormStatus();
  const { product } = useAdminProductState();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      {product?._id !== "" ? "Save Changes" : "Add Product"}
    </Button>
  );
}

function ProductTypeSelect() {
  const { productType } = useAdminProductState();
  return (
    <Select onValueChange={(value) => adminProductStore.updateProductType(value)} value={productType}>
      <SelectTrigger>
        <SelectValue placeholder={productType} defaultValue={productType} />
      </SelectTrigger>
      <SelectContent>
          <SelectItem value="simple">Simple</SelectItem>
          <SelectItem value="variable">Variable</SelectItem>
      </SelectContent>
    </Select>
  )
}