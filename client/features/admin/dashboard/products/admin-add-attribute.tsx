import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  adminProductStore,
  useAdminProductState,
} from "./admin-products-store";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomInputTags } from "@/components/ui/custom-input-tags";

export const AddAttribute = () => {
  const { attributes } = useAdminProductState();
  return (
    <div className="flex gap-4 flex-col bg-foreground/[0.02] border p-4 rounded-md text-sm">
      <div className="flex items-center justify-between">
        <Label>Product Attributes</Label>
        <Button
          type="button"
          className="flex gap-2"
          variant={"outline"}
          onClick={() => adminProductStore.addAttribute()}
        >
          <Plus size={18} /> Add Attribute
        </Button>
      </div>
      {attributes.map((attibute) => (
        <div className="flex items-center gap-2" key={attibute.id}>
          <div className="flex-none gap-2">
            <Label>Name</Label>
            <Input
              required
              type="text"
              name="name"
              placeholder="Name eg. `Colors, Sizes,...`"
              className=" max-w-48"
              onChange={(e)=> adminProductStore.updateAttributeName(attibute.id, e.target.value)}
              defaultValue={attibute.name}
            />
          </div>
          <div className="flex-1 gap-2">
            <Label>Values</Label>
            <CustomInputTags
              onChangeValues={(values)=>adminProductStore.updateAttributeValues(attibute.id, values)}
              value={attibute.values as Array<string>}
              placeholder="Enter values, comma separated..."
            />
          </div>
          <div className="flex-none gap-2">
          <Label>Action</Label>
            <Button
              className="flex gap-2"
              variant={"outline"}
              onClick={() => adminProductStore.removeAttribute(attibute.id)}
            >
              <Trash size={18} /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
