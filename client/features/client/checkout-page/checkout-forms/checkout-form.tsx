"use client";

import { AddressModel, PaymentType } from "@/schemas/models";
import { FC, FormEvent, FormEventHandler } from "react";
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
import PaymentButtons from "@/components/PayPalButton";

interface CheckoutFormProps {
  customer: any;
  selectedAddress: AddressModel | null;
  selectedMethod: PaymentType | null;
  onChangeMethod: (address: PaymentType) => void;
  onChangeAddressValues: (name: string, value: string) => void;
  onChangeUserValues: (name: string, value: string) => void;
}

export const CheckoutForm: FC<CheckoutFormProps> = (props) => {
  const { customer, selectedMethod, selectedAddress, onChangeMethod } = props;

  const handleSubmit = (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    console.log(customer, selectedMethod, selectedAddress)
    console.log("submit");
  };

  const handleSelectTitle = (title: string) => {
    props.onChangeUserValues("title", title);
  }

  return (
    <Card className="w-full md:w-[90%]">
      <CardHeader>
        <CardTitle className="text-2xl">Secure Checkout</CardTitle>
        <CardDescription>Provide your informations and shipping address here.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="mt-2">
        <CardContent>
          <div className=" text-md font-semibold flex flex-col">
            <div className="flex flex-col gap-3 py-6 font-normal">
              <h2 className="text-xl">Personal Informations:</h2>
              <div className="grid gap-2">
                <Label>Select Title *</Label>
                <SelectTitle onChange={handleSelectTitle}/>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 gap-2">
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={(e) =>
                      props.onChangeUserValues(e.target.name, e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    onChange={(e) =>
                      props.onChangeUserValues(e.target.name, e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex-1 gap-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) =>
                    props.onChangeUserValues(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  onChange={(e) =>
                    props.onChangeUserValues(e.target.name, e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 py-6 font-normal">
              <h2 className="text-xl">Shipping Address:</h2>
              <div className="flex-1 gap-2">
                <Label>Full Name *</Label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  onChange={(e) =>
                    props.onChangeAddressValues(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Street *</Label>
                <Input
                  type="text"
                  name="street"
                  placeholder="Street"
                  onChange={(e) =>
                    props.onChangeAddressValues(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 gap-2">
                  <Label>Postal Code *</Label>
                  <Input
                    type="number"
                    name="postalCode"
                    placeholder="Postal Code"
                    onChange={(e) =>
                      props.onChangeAddressValues(e.target.name, e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label>City *</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    onChange={(e) =>
                      props.onChangeAddressValues(e.target.name, e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex-1 gap-2">
                <Label>Country *</Label>
                <Input
                  type="text"
                  name="country"
                  placeholder="Country"
                  onChange={(e) =>
                    props.onChangeAddressValues(e.target.name, e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 py-6 font-normal">
              <span className="text-xl">Payment Method:</span>
              <PaymentMethodForm
                selectedMethod={selectedMethod as PaymentType}
                onChange={onChangeMethod}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <PaymentButtons />
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
