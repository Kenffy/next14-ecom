"use client"
import { FileModel } from "@/schemas/models";
import Image from "next/image";
import { FC } from "react";
import { ImageContextMenu } from "./image-context-menu";

interface AdminProductGalleryProps {
    images: Array<FileModel>;
}

export const AdminProductGallery: FC<AdminProductGalleryProps> = (props) => {
    const { images } = props;
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold mb-3">Product Gallery</h2>
            {images.length > 0 &&
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                        <div key={index} className="h-[190px] max-w-[150px] border relative overflow-hidden rounded-sm bg-muted/50">
                            <Image src={image.url} alt={image.name} height={100} width={100} className="h-full w-full object-cover" />
                            <div className='cursor-pointer absolute top-0 right-0 p-2 bg-muted/30 hover:bg-muted/50 rounded-bl-sm'>
                                <ImageContextMenu image={image} />
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}