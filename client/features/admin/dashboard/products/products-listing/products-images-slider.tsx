import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { FileModel } from '@/schemas/models';
import Image from 'next/image';
import React, { FC } from 'react';
import { ImageContextMenu } from './image-context-menu';

interface ImageSliderProps {
    images: Array<FileModel>;
}

export const ImageSlider: FC<ImageSliderProps> = (props) => {
    const { images } = props;
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-1 sm:basis-1/5 md:basis-auto ">
                        <div key={index} className="h-[190px] max-w-[150px] border relative overflow-hidden rounded-sm bg-muted/50">
                            <Image src={image.url} alt={image.fileName} height={100} width={100} className="h-full w-full object-cover" />
                            <div className=' absolute top-0 right-0 p-2 bg-muted/50 hover:bg-muted/30 rounded-bl-sm'>
                                <ImageContextMenu image={image} />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
