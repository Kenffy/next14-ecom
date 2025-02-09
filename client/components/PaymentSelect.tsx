"use client";
import { useState } from "react";
import { IoMdRadioButtonOff } from "react-icons/io";
import { IoMdRadioButtonOn } from "react-icons/io";

export default function PaymentSelect() {
  const [selectedMethod, setSelectedMethod] = useState<number | undefined>();
  return (
    <div className=" flex flex-col gap-4">
      <h2 className="">Select your payment method</h2>
      <div className=" flex flex-col gap-3">
        <div
          onClick={() => setSelectedMethod(1)}
          className=" flex items-center cursor-pointer gap-4"
        >
          <div>
            {selectedMethod == 1 ? (
              <IoMdRadioButtonOn size={22} />
            ) : (
              <IoMdRadioButtonOff size={22} />
            )}
          </div>

          <div className=" flex items-center gap-2">
            <img
              src="/images/mcard.png"
              className=" h-[40px] w-[65px] border py-1 rounded-md object-contain"
              alt="master card"
            />
            <img
              src="/images/visa.png"
              className=" h-[40px] w-[65px] border py-1 rounded-md object-contain"
              alt="visa card"
            />
          </div>
        </div>
        <div
          onClick={() => setSelectedMethod(2)}
          className=" flex items-center cursor-pointer gap-4"
        >
          <div>
            {selectedMethod == 2 ? (
              <IoMdRadioButtonOn size={22} />
            ) : (
              <IoMdRadioButtonOff size={22} />
            )}
          </div>
          <img
            src="/images/paypal.png"
            className=" h-[40px] w-[65px] border py-1 rounded-md object-contain"
            alt="paypal"
          />
        </div>
        <div
          onClick={() => setSelectedMethod(3)}
          className=" flex items-center cursor-pointer gap-4"
        >
          <div>
            {selectedMethod == 3 ? (
              <IoMdRadioButtonOn size={22} />
            ) : (
              <IoMdRadioButtonOff size={22} />
            )}
          </div>
          <img
            src="/images/gpay.png"
            className=" h-[40px] w-[65px] border py-1 rounded-md object-contain"
            alt="google pay"
          />
        </div>
      </div>
    </div>
  );
}
