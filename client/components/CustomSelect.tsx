import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const handleChange = (item: any) => {
    onChange(item);
  };

  return (
    <Select onValueChange={(item) => handleChange(item)} value={selected}>
      <SelectTrigger className={width ? width : "w-[150px] md:w-[180px]"}>
        <SelectValue
          placeholder={
            selected?.type
              ? selected.type
              : selected?.name
              ? selected.name
              : selected
          }
        />
      </SelectTrigger>
      <SelectContent className=" z-20">
        <SelectGroup>
          {items.map((item, index) => {
            return (
              <SelectItem key={index} value={item}>
                {item?.type ? item.type : item?.name ? item.name : item}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
