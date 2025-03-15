import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Titles } from "@/data/data";

export default function SelectTitle() {
  return (
    <Select>
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
