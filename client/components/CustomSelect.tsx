import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectProps = {
  items: any[];
  selected: any;
  width?: string;
  onChange: (value: any) => void;
};

export default function CustomSelect({
  items,
  selected,
  onChange,
  width,
}: SelectProps) {
  const handleChange = (value: string) => {
    const item = items.find((item) => {
      return item?.type
        ? item.type === value
        : item?.name
        ? item.name === value
        : item === value;
    });
    onChange(item);
  };

  const selectedLabel = selected?.type
      ? selected.type
      : selected?.name
      ? selected.name
      : selected;

  return (
    <Select onValueChange={(item) => handleChange(item)} value={selected}>
      <SelectTrigger className={cn("z-50", width ? width : "w-[150px] md:w-[180px]")}>
        <SelectValue
          placeholder={selectedLabel}
        />
      </SelectTrigger>
      <SelectContent className=" z-20">
        <SelectGroup>
          {items.map((item, index) => {
            const itemValue = item?.type
            ? item.type
            : item?.name
            ? item.name
            : item;
            return (
              <SelectItem key={index} value={itemValue}>
                {itemValue}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
