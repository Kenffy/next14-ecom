import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { MdClose } from "react-icons/md";
//import AuthForms from "./auth/AuthForms";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AuthForms from "@/features/auth-page/auth-forms";

type Props = {
  onClose: Dispatch<SetStateAction<boolean>>;
};

export default function CheckoutAuthOptions({ onClose }: Props) {
  return (
    <div className=" min-h-screen w-full fixed top-0 left-0 flex justify-center z-50 bg-black/80">
      <Card className=" flex flex-col mx-2 md:mx-0 mt-[60px] md:mt-[80px] w-[90%] md:w-[450px] h-fit  rounded-md">
        <div className=" p-4 flex items-center justify-between border-b">
          <h1 className=" font-bold">Go to checkout</h1>
          <button
            className=" h-[30px] w-[30px] flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20"
            onClick={() => onClose(false)}
          >
            <MdClose size={22} />
          </button>
        </div>

        <div className=" flex items-center justify-center p-4 border-b-[1px]">
          <Link
            href={`/checkout?guest=true`}
            className=" w-full "
            onClick={() => onClose(false)}
          >
            <Button variant="outline" className=" w-full">
              Continue as guest
            </Button>
          </Link>
        </div>

        <div className=" flex flex-col p-4 border-b-[1px]">
          <h1 className=" py-2 font-bold">Sign in or register</h1>
          <AuthForms />
        </div>

        <div className=" py-4 w-full">
          <p className=" text-xs w-[90%] m-auto text-center">
            By clicking continue of one of those signin methods you are agreeing
            to our <b>Terms of Services</b> and <b>Privacy Policy</b>
          </p>
        </div>
      </Card>
    </div>
  );
}
