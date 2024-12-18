import { Button } from "@/components/ui/button";
import { showError } from "@/features/globals/global-message-store";
import { PlusIcon, SquareX } from "lucide-react";
import Image from "next/image";
import { FC, useRef, useState } from "react";
import {
  adminListingStore,
  useAdminListingState,
} from "./products-listing-store";
import { FileModel } from "@/schemas/models";

interface ProductImagesInputProps { 
  uploadedImages?: Array<FileModel>;
  onImagesChange: (formData: FormData, size: number) => void;
  onRemoveImage?: (image: FileModel) => void;
}
const MAX_UPLOAD_FILES = 5;

export const ProductImagesInput: FC<ProductImagesInputProps> = (props) => {
  const { uploadedImages, onRemoveImage, onImagesChange} = props;
  const [images, setImages] = useState<File[]>([]);
  const [warning, setWarning] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadedSizes = uploadedImages ? uploadedImages.length : 0;
  const restToUploadSizes = uploadedSizes > 0? MAX_UPLOAD_FILES - uploadedSizes : MAX_UPLOAD_FILES;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // FileList not iterable for target == es5
      setWarning("");
      const files = Object.values(event.target.files);
      const totalOfItems = uploadedSizes + images.length + files.length;
      if (totalOfItems > MAX_UPLOAD_FILES) {
        const errorMessage = `You exceeded the max upload files: ${MAX_UPLOAD_FILES}. \n\n Only The first  ${restToUploadSizes} files will be selected.`;
        showError(errorMessage);
        setWarning(errorMessage);
      }
      const samples = [...images, ...files].slice(0, restToUploadSizes);
      setImages([...samples]);
      updateStore(samples);
    }
  };

  const handleRemoveImage = (index: number) => {
    const samples = images.filter((image, i) => i !== index);
    setImages([...samples]);
    updateStore(samples);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const updateStore = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    onImagesChange(formData, files.length);
  };

  return (
    <div className="rounded-md p-2 border flex flex-col gap-4">
      {warning && <small className=" text-orange-400">{warning}</small>}
      {onRemoveImage && uploadedImages && uploadedImages.length > 0 &&
      <>
      <small>Uploaded images</small>
      <div className="flex flex-wrap gap-2">
        {uploadedImages.map((image, index) => (
          <div
            key={index}
            className="relative w-[75px] h-[75px] rounded-sm overflow-hidden bg-muted/50"
          >
            <Image
              height={75}
              width={75}
              src={image.url}
              alt="Uploaded Image"
              className=" h-full w-full object-cover object-center"
            />
            <SquareX
              onClick={() => onRemoveImage(image)}
              size={16}
              className="bg-foreground text-background transition-all duration-75 cursor-pointer absolute top-0 right-0"
            />
          </div>
        ))}
      </div>
      </>
      }
      <>
      <small>New images</small>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-[75px] h-[75px] rounded-sm overflow-hidden bg-muted/50"
          >
            <Image
              height={75}
              width={75}
              src={URL.createObjectURL(image)}
              alt="Uploaded Image"
              className=" h-full w-full object-cover object-center"
            />
            <SquareX
              onClick={() => handleRemoveImage(index)}
              size={16}
              className="bg-foreground text-background transition-all duration-75 cursor-pointer absolute top-0 right-0"
            />
          </div>
        ))}
        <>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {images.length < restToUploadSizes && (
            <Button
              className="h-[75px] w-[75px]"
              variant={"secondary"}
              onClick={handleClick}
              type="button"
            >
              <PlusIcon className=" text-muted-foreground" size={30} />
            </Button>
          )}
        </>
      </div>
      </>
    </div>
  );
};
