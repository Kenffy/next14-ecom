import React, { ReactNode } from "react";

export default function Separator({ children }: { children: ReactNode }) {
  return (
    <div className="w-full relative">
      <div className=" flex items-center justify-center absolute z-10 top-0 bottom-0 right-0 left-0 m-auto">
        <span className=" w-[40px] h-[40px] flex items-center justify-center bg-background text-foreground rounded-full">
          {children}
        </span>
      </div>
      <div className=" w-full absolute top-0 bottom-0 m-auto h-[1px] bg-black/30 dark:bg-white/30"></div>
    </div>
  );
}
