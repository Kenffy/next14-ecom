import React from "react";
import { Input, InputProps } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";


const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
      return (
        <div className="relative">
            <Input 
                type={showPassword? "text":"password"}
                className={cn("pe-10", className)}
                ref={ref}
                {...props}
            />
            <button type="button" 
            onClick={()=> setShowPassword(!showPassword)}
            title={showPassword? "hide password" : "show password"}
            className=" absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                {showPassword? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
        </div>
      );
    }
  );
  PasswordInput.displayName = "PasswordInput";
  
  export { PasswordInput };