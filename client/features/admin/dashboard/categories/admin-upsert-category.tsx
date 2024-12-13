import { ServerActionResponse } from "@/features/common/server-action-response";
import { FC } from "react";
import { AddOrUpdateCategory, adminCategoryStore, useAdminCategoryState } from "./admin-categories-store";
import { useFormState, useFormStatus } from "react-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


interface UpsertCategoryProps {}

export const UpsertCategory: FC<UpsertCategoryProps> = (props) => {
    const initialState: ServerActionResponse | undefined = undefined;

    const { isOpened, category } = useAdminCategoryState();

    const [formState, formAction] = useFormState(AddOrUpdateCategory, initialState);

  return (
    <Dialog open={isOpened}
        onOpenChange={(value: boolean) => {
            adminCategoryStore.updateOpened(value);
        }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex gap-2">
            {category._id !== "" ? "Update Category": "Add Category"}
          </DialogTitle>
          <DialogDescription>
            Add and update Categories
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex-1 mt-4 flex flex-col">
            <div className=" flex gap-6 flex-col  flex-1">
            <input type="hidden" name="id" defaultValue={category._id} />
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
                <Label>Name</Label>
                <Input
                    type="text"
                    required
                    name="name"
                    placeholder="Name"
                    defaultValue={category.name}
                />
            </div>
            <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                    required
                    name="desc"
                    placeholder="Description"
                    defaultValue={category.desc}
                />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              
              <Submit />
            </DialogFooter>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Submit() {
  const status = useFormStatus();
  const { category } = useAdminCategoryState();
  return (
    <Button disabled={status.pending} className="gap-2">
      <LoadingIndicator isLoading={status.pending} />
      {category._id !== "" ? "Save Changes": "Add Category"}
    </Button>
  );
}