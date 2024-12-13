import Rating from "../Rating";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { Card } from "../ui/card";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ReviewCard({ review }: { review: any }) {
  const CustomCard = ({ hover }: { hover: boolean }) => {
    return (
      <Card className=" flex flex-1 flex-col gap-4 px-4 py-6 rounded-md overflow-hidden hover:scale-[1.01] duration-100">
        <div className=" w-full flex items-center justify-between">
          <FaQuoteLeft size={24} />
          <span className=" text-sm">{review?.createdAt}</span>
        </div>

        <div className=" flex-grow">
          <p className={`text-sm ${hover ? "" : "md:line-clamp-3"}`}>
            {review?.desc}
          </p>
        </div>

        <div className=" flex items-center justify-between">
          <div className=" flex flex-col gap-1">
            <span className=" font-semibold">{review?.username}</span>
            <Rating value={review?.rating} />
          </div>
          <Image
            height={200}
            width={200}
            src={review?.profile ? review.profile : "/images/default.png"}
            alt="user profile"
            className="h-[60px] w-[60px] rounded-full object-cover object-center cursor-pointer"
          />
        </div>
      </Card>
    );
  };

  return (
    <>
      <div className=" hidden md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <CustomCard hover={false} />
          </PopoverTrigger>
          <PopoverContent className="border-none min-w-96">
            <CustomCard hover={true} />
          </PopoverContent>
        </Popover>
      </div>

      <div className=" md:hidden">
        <CustomCard hover={true} />
        {/* <HoverCard>
          <HoverCardTrigger asChild>
            <CustomCard hover={false} />
          </HoverCardTrigger>
          <HoverCardContent className=" border-none min-w-80">
            <CustomCard hover={true} />
          </HoverCardContent>
        </HoverCard> */}
      </div>
    </>
  );
}
