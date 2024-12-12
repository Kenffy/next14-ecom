"use client";


import { RevalidateCache } from "@/features/common/navigation-helpers";
import { Image, MoreVertical, Pencil, Trash } from "lucide-react";
import { FC, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileModel } from "@/schemas/models";
import { LoadingIndicator } from "@/components/ui/loading";
import { adminProductListingStore } from "./products-listing-store";

interface Props {
    image: FileModel;
    productId?: string;
}

type DropdownAction = "edit" | "delete";

export const ImageContextMenu: FC<Props> = (props) => {
    const { isLoading, handleAction } = useDropdownAction({
        image: props.image,
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {isLoading ? (
                        <LoadingIndicator isLoading={isLoading} />
                    ) : (
                        <MoreVertical size={18} />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2"
                        onClick={() => adminProductListingStore.setProductDefaultImage(props.image.url)}
                    >
                        <Image size={18} />
                        <span>As default Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2"
                        onClick={async () => await handleAction("delete")}
                    >
                        <Trash size={18} />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const useDropdownAction = (props: { image: FileModel }) => {
    const { image } = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: DropdownAction) => {
        setIsLoading(true);
        switch (action) {
            case "delete":
                if (
                    window.confirm(`Are you sure you want to delete this image?`)
                ) {
                    //await DeleteExtension(extension.id);
                    //   RevalidateCache({
                    //     page: "extensions",
                    //   });
                }

                break;
        }
        setIsLoading(false);
    };

    return {
        isLoading,
        handleAction,
    };
};
