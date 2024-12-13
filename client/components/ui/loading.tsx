import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { FC } from "react";

interface Props {
  isLoading: boolean;
}

export const LoadingIndicator: FC<Props> = (props) => {
  if (!props.isLoading) return null;

  return <Loader className={cn("animate-spin")} size={18} />;
};
