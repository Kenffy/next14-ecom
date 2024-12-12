import { FC, useState } from "react";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { useFormState, useFormStatus } from "react-dom";
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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


interface UpsertProductProps { }

export const UpsertProduct: FC<UpsertProductProps> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const { product } = useAdminProductState();

  const [formState, formAction] = useFormState(AddOrUpdateProduct, initialState);

  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  const handleCancel = () => {
    adminProductStore.cancelAddOrEditProduct();
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
              <Label>Name</Label>
              <Input
                type="text"
                required
                name="name"
                placeholder="Name"
                defaultValue={product.name}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  required
                  name="quantity"
                  placeholder="Quantity"
                  defaultValue={product.quantity}
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Price</Label>
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
              <Label>Description</Label>
              <Textarea
                required
                name="desc"
                placeholder="Description"
                defaultValue={product.desc}
              />
            </div>
            {/* <div className="grid gap-2">
              <Label>Sizes</Label>
              <ItemsInput
                value={sizes}
                onChange={setSizes}
                placeholder="Enter values, comma separated..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Colors</Label>
              <ItemsInput
                value={colors}
                onChange={setColors}
                placeholder="Enter values, comma separated..."
              />
            </div> */}
            <div className="grid gap-2">
              <Label>Category</Label>
              <CategorySelect />
            </div>

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
              <div className="flex items-center space-x-2 gap-2">
                <Switch name="personalisable" id="personalisable" defaultChecked={product.personalisable} />
                <Label htmlFor="personalisable">Personalisable</Label>
              </div>
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

function CategorySelect() {
  const { category } = useAdminProductState();
  return (
    <Select onValueChange={(value) => adminProductStore.updateCategory(value)} value={category}>
      <SelectTrigger className="">
        <SelectValue placeholder={category} defaultValue={category} />
      </SelectTrigger>
      <SelectContent>
        {adminProductStore.categories.map((category, index) => (
          <SelectItem key={index} value={category.name}>{category.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}