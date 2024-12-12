import { FC, PropsWithChildren } from "react";
import { Button } from "./ui/button";

interface HeroProps extends PropsWithChildren {
    title: React.ReactNode;
    actionTitle: string;
    description: string;
    actionIcon: React.ReactNode;
    onClick: () => void;
    actionDescription: string;
}

export const CustomHero: FC<HeroProps> = (props) => {
    return (
        <div className="border-b w-full py-4">
            <div className="container max-w-5xl px-4 md:px-8 mx-auto">
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 flex-col items-start">
                        <h1 className="text-2xl font-bold flex gap-2 items-center">
                            {props.title}
                        </h1>
                        <p className="text-muted-foreground max-w-xl text-sm">{props.description}</p>
                    </div>
                    <Button
                        variant={"outline"}
                        className="flex flex-col gap-4 min-w-44 h-auto p-2 items-center text-start justify-start"
                        onClick={props.onClick}
                    >
                        <span className="flex gap-2 items-center text-primary">
                            <span>{props.actionIcon}</span>
                            <span className="">{props.actionTitle}</span>
                        </span>

                        <span className="text-muted-foreground whitespace-break-spaces font-normal text-xs">
                            {props.actionDescription}
                        </span>
                    </Button>

                </div>
            </div>
        </div>
    );
};

