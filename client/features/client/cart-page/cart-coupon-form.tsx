import { BiSolidCoupon } from "react-icons/bi";

export default function CouponCodeForm() {
    return (
        <div className=" flex flex-col gap-4">
            <div className=" flex items-center gap-2 text-md">
                <BiSolidCoupon size={20} />
                <span>Apply shop coupon codes</span>
            </div>

            <form className=" flex items-center border-[2px] border-white/50 rounded-md overflow-hidden w-fit">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    className=" bg-transparent px-4 py-2 text-md outline-none"
                />
                <button className=" py-2 px-4 bg-white text-black font-bold hover:bg-white/60">
                    Apply
                </button>
            </form>
        </div>
    )
}
