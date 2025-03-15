"use client"

import { PaymentType } from "@/schemas/models";
import { FC } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SelectTitle from "./select-title";
import { PaymentMethodForm } from "./payment-method-form";

interface CheckoutFormProps {
    selectedMethod: PaymentType | null;
    onChange: (address: PaymentType) => void;
}

export const CheckoutForm: FC<CheckoutFormProps> = (props) => {
    const { selectedMethod, onChange } = props;

    const handleSubmit = () => {
        console.log("submit");
      };

  return (
    <Card className="w-full md:w-[90%]">
      <CardHeader>
        <CardTitle className="text-2xl">Shipping Address</CardTitle>
        <CardDescription>Provide your shipping address here.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="mt-2">
        <CardContent>
          <div className=" text-md font-semibold flex items-center justify-between">
            <Accordion
              type="single"
              collapsible
              defaultValue="personal-informations"
              className="w-full"
            >
              <AccordionItem value="personal-informations" className="py-3">
                <AccordionTrigger className="py-1">
                  <div className="flex items-center justify-between w-full font-semibold">
                    <span className="text-xl">Personal Informations:</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 py-6 font-normal">
                  <div className="grid gap-2">
                    <Label>Select Title*</Label>
                    <SelectTitle />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 gap-2">
                      <Label>Last Name*</Label>
                      <Input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                    <div className="flex-1 gap-2">
                      <Label>First Name*</Label>
                      <Input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label>Email*</Label>
                    <Input type="email" name="email" placeholder="Email" required/>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      name="phone"
                      placeholder="Phone Number (optional)"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping-address" className="py-3">
                <AccordionTrigger className="py-1">
                  <div className="flex items-center justify-between w-full font-semibold">
                    <span className="text-xl">Shipping Address:</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 py-6 font-normal">
                  <div className="flex-1 gap-2">
                    <Label>Full Name*</Label>
                    <Input type="text" name="fullName" placeholder="Full Name" required/>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label>Street*</Label>
                    <Input type="text" name="street" placeholder="Street" required/>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 gap-2">
                      <Label>Postal Code*</Label>
                      <Input
                        type="number"
                        name="postalCode"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                    <div className="flex-1 gap-2">
                      <Label>City*</Label>
                      <Input type="text" name="city" placeholder="City" required/>
                    </div>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label>Country*</Label>
                    <Input type="text" name="country" placeholder="Country" required/>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-method" className="py-3">
                <AccordionTrigger className="py-1">
                  <div className="flex items-center justify-between w-full font-semibold">
                    <span className="text-xl">Payment Method:</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 py-6 font-normal">
                  <PaymentMethodForm 
                  selectedMethod={selectedMethod as PaymentType}
                  onChange={onChange}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Button variant={"outline"} type="button" className="w-full">
            Cancel
          </Button>
          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
