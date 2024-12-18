
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

interface MessageProp {
  title: string;
  description: string;
}

export const showError = (error: string, reload?: () => void) => {
  toast({
    variant: "destructive",
    description: error,
    action: reload ? (
      <ToastAction
        altText="Try again"
        onClick={() => {
          reload();
        }}
      >
        Try again
      </ToastAction>
    ) : undefined,
  });
};
export const showSuccess = (message: MessageProp) => {
  toast(message);
};
