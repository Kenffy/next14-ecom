"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { it } from "node:test";

type SelectProps = {
  items: any[];
  selected: any;
  width?: string;
  onChange: (value: any) => void;
};

export function CustomComboBox({
  items,
  selected,
  onChange,
  width,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selected);

  const handleChange = (item: any) => {
    onChange(item);
    setValue(item);
    setOpen(false);
  };

  const ValueLabel = selected?.type
      ? selected.type
      : selected?.name
      ? selected.name
      : selected;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", width ? width : "w-[180px] md:w-[200px]")}
        >
          {ValueLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", width ? width : "w-[180px] md:w-[200px]")}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => {
                const itemValue = item?.type
                ? item.type
                : item?.name
                ? item.name
                : item;
                return (
                  <CommandItem
                    key={index}
                    value={itemValue}
                    onSelect={() => handleChange(item)}
                  >
                    {itemValue}
                    <Check
                      className={cn(
                        "ml-auto",
                        ValueLabel === itemValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
