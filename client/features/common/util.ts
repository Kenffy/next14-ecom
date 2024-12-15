import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';

export const GetTime = (date: Date) => {
    return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
};

export const GenerateSlug = (value: string) => {
  return slugify(value, { lower: true, strict: true})
};

export const uniqueId = ()=>{
  return uuidv4();
}