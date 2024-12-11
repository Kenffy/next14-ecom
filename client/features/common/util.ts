import slugify from "slugify";

export const GetTime = (date: Date) => {
    return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
};

export const GenerateSlug = (value: string) => {
  return slugify(value, { lower: true, strict: true})
};