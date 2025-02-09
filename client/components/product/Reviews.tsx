
import { RxAvatar } from "react-icons/rx";
import Rating from "../Rating";

type ReviewProps = {
  rating: number;
  reviews: number;
};

export default function ProductReviews({ rating, reviews }: ReviewProps) {
  return (
    <div className=" flex flex-col gap-4">
      <div className=" flex items-center gap-4 py-3 border-b-[2px]">
        <h1 className=" text-xl font-bold">132 Reviews</h1>
        <Rating value={rating} />
      </div>
      <div className=" flex flex-col gap-6">
        {[...Array(4)].map((item, index) => (
          <div
            key={index}
            className=" flex flex-col gap-2 py-4 border-b-[1px]"
          >
            <div className=" flex items-center justify-between">
              <Rating value={rating} />
            </div>
            <div>
              <p className=" text-sm">
                Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet. Lorem ipsum dolor sit amet
              </p>
            </div>
            <div className=" flex items-center gap-2">
              <RxAvatar />
              <span className=" text-xs">John Doe</span>
              <span className=" text-xs">{new Date().toDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
