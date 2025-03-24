import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Titles } from "@/data/data";

interface SelectTitleProps {
  onChange: (title: string) => void;
}

export default function SelectTitle(props: SelectTitleProps) {
  return (
    <Select onValueChange={(value) => props.onChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="-- Select --" />
      </SelectTrigger>
      <SelectContent>
        {Titles.map((title) => (
          <SelectItem key={title.id} value={title.value}>
            {title.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
