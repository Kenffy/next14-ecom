"use client";

import { ServerActionResponse } from "@/features/common/server-action-response";
import { FC } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AddOrUpdateProductVariant,
  adminListingStore,
  useAdminListingState,
} from "./products-listing-store";
import { ProductImagesInput } from "./products-images-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileModel, ProductAttribute, VariantAttribute } from "@/schemas/models";

interface UpsertProductVariantProps { }

export const UpsertProductVariant: FC<UpsertProductVariantProps> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const { isOpened, product, productVariant, uploadedImages, variantAttributes } = useAdminListingState();

  const [formState, formAction] = useFormState(
    AddOrUpdateProductVariant,
    initialState
  );

  return (
    <Dialog
      open={isOpened}
      onOpenChange={(value: boolean) => {
        adminListingStore.updateOpened(value);
      }}
    >
      <DialogContent className="sm:max-w-[580px] h-3/4">
        <DialogHeader>
          <DialogTitle className="text-2xl flex gap-2">
            {productVariant && productVariant._id !== ""
              ? "Update Product Variant"
              : "Add Product Variant"}
          </DialogTitle>
          <DialogDescription>Add and update product variants</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <form action={formAction} className=" flex flex-col gap-6">
            <div className="flex-grow overflow-y-auto flex gap-4 p-1 flex-col flex-1">
              <input type="hidden" name="id" defaultValue={productVariant?._id} />
              <input type="hidden" name="productId" defaultValue={productVariant?.productId} />
              {formState && formState.status === "OK" ? null : (
                <>
                  {formState &&
                    formState.errors.map((error, index) => (
                      <div key={index} className="text-red-500">
                        {error.message}
                      </div>
                    ))}
                </>
              )}
              <div className="grid gap-2">
                <Label>SKU</Label>
                <Input
                  type="text"
                  required
                  name="sku"
                  placeholder="SKU"
                  defaultValue={productVariant.sku}
                />
              </div>
              {product?.type === "variable" && product?.attributes && product.attributes.length > 0 && 
              <>
              {product.attributes.map((attribute)=> (
                <div className="grid gap-2" key={attribute.id}>
                  <Label>{attribute.name}</Label>
                  <AttributeSelect 
                  value={variantAttributes.find(a => a.name === attribute.name) as VariantAttribute} 
                  attribute={attribute as ProductAttribute}/>
                </div>
              ))}
              </>
              }
              <div className="flex items-center gap-2">
                <div className="flex-1 gap-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    required
                    name="quantity"
                    placeholder="Quantity"
                    defaultValue={
                      productVariant.inventory.quantity !== 0
                        ? productVariant.inventory.quantity
                        : product?.inventory?.quantity
                    }
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    required
                    name="price"
                    placeholder="Price"
                    defaultValue={
                      productVariant.price !== 0
                        ? productVariant.price
                        : product?.price
                    }
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label>Discount in %</Label>
                  <Input
                    type="number"
                    required
                    name="discount"
                    placeholder="Discount Price"
                    defaultValue={productVariant.discount}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Product Images </Label>
                <ProductImagesInput 
                uploadedImages={uploadedImages as Array<FileModel>}
                onRemoveImage={(image) => adminListingStore.removeUploadedImage(image)}
                onImagesChange={(formData, size) => adminListingStore.updateUploads(formData, size)}
                />
              </div>
            </div>
            <DialogFooter className="flex items-center justify-end">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Submit />
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

function Submit() {
  const status = useFormStatus();
  const { productVariant } = useAdminListingState();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      {productVariant._id !== "" ? "Save Changes" : "Add Product Variant"}
    </Button>
  );
}

function AttributeSelect({attribute, value}: {attribute: ProductAttribute, value: VariantAttribute}) {
  return (
    <Select 
    onValueChange={(value) => adminListingStore.updateVariantAttributeValues(attribute.name, value)}>
      <SelectTrigger>
        <SelectValue placeholder={value && value.value !== "" ? value.value : "Select a value"} />
      </SelectTrigger>
      <SelectContent>
        {attribute.values.map((value, index) => (
          <SelectItem key={index} value={value}>{value}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
