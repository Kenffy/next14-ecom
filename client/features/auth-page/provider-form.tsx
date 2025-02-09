import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { Button } from "@/components/ui/button";

export default function ProvidersForm() {
  return (
    <div className=" flex flex-col gap-4">
      <Button
        variant="outline"
        className=" flex items-center justify-center gap-2 p-2"
      >
        <FcGoogle /> Continue with Google
      </Button>
      {/* <Button
        variant="outline"
        className=" flex items-center justify-center gap-2 p-2"
      >
        <BsApple /> Continue with Apple
      </Button> */}
    </div>
  );
}
