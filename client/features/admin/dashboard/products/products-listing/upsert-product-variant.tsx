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
import { Textarea } from "@/components/ui/textarea";
import { ProductVariantModel } from "@/schemas/models";
import {
  AddOrUpdateProductVariant,
  adminProductListingStore,
  useAdminProductListingState,
} from "./products-listing-store";
import { ProductImagesInput } from "./products-images-input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UpsertProductVariantProps { }

export const UpsertProductVariant: FC<UpsertProductVariantProps> = (props) => {
  const initialState: ServerActionResponse | undefined = undefined;

  const { isOpened, product, productVariant } = useAdminProductListingState();

  const [formState, formAction] = useFormState(
    AddOrUpdateProductVariant,
    initialState
  );

  return (
    <Dialog
      open={isOpened}
      onOpenChange={(value: boolean) => {
        adminProductListingStore.updateOpened(value);
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
                <Label>Color</Label>
                <Input
                  type="text"
                  required
                  name="color"
                  placeholder="Color"
                  defaultValue={productVariant.color}
                />
              </div>
              <div className="grid gap-2">
                <Label>Size</Label>
                <Input
                  type="text"
                  required
                  name="size"
                  placeholder="Size"
                  defaultValue={productVariant.size}
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
                    defaultValue={
                      productVariant.quantity !== 0
                        ? productVariant.quantity
                        : product?.quantity
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
                  <Label>Discount Price</Label>
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
                <Label>Short Description</Label>
                <Textarea
                  required
                  name="desc"
                  placeholder="Description"
                  className="resize-none"
                  rows={3}
                  defaultValue={productVariant.desc}
                />
              </div>
              <div className="grid gap-2">
                <Label>Product Images</Label>
                <ProductImagesInput />
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
  const { productVariant } = useAdminProductListingState();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      {productVariant._id !== "" ? "Save Changes" : "Add Product Variant"}
    </Button>
  );
}
