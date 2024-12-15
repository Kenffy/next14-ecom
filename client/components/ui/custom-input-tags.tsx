import React from "react";
import { cn } from "@/lib/utils";
import { InputTags, InputTagsProps } from "./input-tags";

type CustomInputTagsProps = Omit<InputTagsProps, "onChange"> & {
  onChangeValues: (items: Array<string>) => void;
}

const CustomInputTags = React.forwardRef<HTMLInputElement, CustomInputTagsProps>(
  ({ className, value, onChangeValues, ...props }, ref) => {
    const [values, setValues] = React.useState<string[]>([...value]);
    return (
      <div className="relative">
        <InputTags
          value={values}
          onChange={setValues}
          onChangeValues={onChangeValues}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
CustomInputTags.displayName = "CustomInputTags";

export { CustomInputTags };
