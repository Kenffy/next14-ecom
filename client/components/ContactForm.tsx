import React from "react";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";

export default function ContactForm() {
  return (
    <form className="p-6 flex flex-col gap-4">
      <h2 className=" text-2xl lg:text-3xl mb-4">Write us a message</h2>
      <Input type="text" required placeholder="Your Name*" />
      <Input type="email" required placeholder="Your Email Address*" />
      <Input type="text" required placeholder="Your Subject*" />
      <Input type="text" placeholder="Your Number" />
      <Textarea required placeholder="Write your message*" rows={3}/>
      <Button type="submit" className=" w-full mt-3">
        <span className=" uppercase font-semibold">Submit</span>
      </Button>
    </form>
  );
}
