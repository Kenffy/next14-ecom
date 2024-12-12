import { FC, PropsWithChildren } from "react";
import { Button } from "./button";

interface HeroProps extends PropsWithChildren {
  title: React.ReactNode;
  description: string;
}

export const Hero: FC<HeroProps> = (props) => {
  return (
    <div className="border-b w-full py-4">
      <div className="container max-w-5xl px-4 md:px-8 mx-auto h-full flex flex-col gap-4">
        <div className="flex gap-2 flex-col items-start">
          <h1 className="text-2xl font-bold flex gap-2 items-center">
            {props.title}
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm">{props.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">{props.children}</div>
      </div>
    </div>
  );
};

interface HeroButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export const HeroButton: FC<HeroButtonProps> = (props) => {
  return (
    <Button
      variant={"outline"}
      className="flex flex-col gap-4 h-auto p-4 items-start text-start justify-start"
      onClick={props.onClick}
    >
      <span className="flex gap-2 items-center text-primary">
        <span>{props.icon}</span>
        <span className="">{props.title}</span>
      </span>

      <span className="text-muted-foreground whitespace-break-spaces font-normal">
        {props.description}
      </span>
    </Button>
  );
};
