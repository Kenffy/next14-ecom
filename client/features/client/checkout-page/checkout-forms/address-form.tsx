import { AddressModel } from '@/schemas/models';
import React, { FC, useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Edit } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddressFormProps {
    addressList: Array<AddressModel>;
  selectedAddress: AddressModel | null;
  onChange: (address: AddressModel) => void;
}

export const AddressForm: FC<AddressFormProps> = (props) => {

    const { addressList, selectedAddress, onChange } = props;

    const [onEditShippingAddress, setOnEditShippingAddress] = useState<boolean>(false);
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <Card className="w-full md:w-[90%]">
      <CardHeader>
        <CardTitle className="text-2xl">Shipping Address</CardTitle>
        <CardDescription>Provide your shipping address here.</CardDescription>
      </CardHeader>

      {selectedAddress && addressList.length > 0 && !onEditShippingAddress ? (
        <CardContent>
          <div className="flex flex-col relative pb-3">
            <span>{`${selectedAddress.fullName}`}</span>
            <span>{`${selectedAddress.street}`}</span>
            <span>{`${selectedAddress.postalCode}, ${selectedAddress.city}`}</span>
            <span>{`${selectedAddress.country}`}</span>
            <Edit
              size={16}
              onClick={() => setOnEditShippingAddress(true)}
              className="absolute cursor-pointer top-0 right-0"
            />
            <SelectShippingAddressDialog
              selectedAddress={selectedAddress}
              addressList={addressList}
              onChange={onChange}
            />
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit} className="">
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex-1 gap-2">
                <Label>Full Name*</Label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={selectedAddress?.fullName}
                  required
                />
              </div>
              <div className="flex-1 gap-2">
                <Label>Street*</Label>
                <Input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={selectedAddress?.street}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 gap-2">
                  <Label>Postal Code*</Label>
                  <Input
                    type="number"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={selectedAddress?.postalCode}
                    required
                  />
                </div>
                <div className="flex-1 gap-2">
                  <Label>City*</Label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={selectedAddress?.city}
                    required
                  />
                </div>
              </div>
              <div className="flex-1 gap-2">
                <Label>Country*</Label>
                <Input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={selectedAddress?.country}
                  required
                />
              </div>
            </div>
          </CardContent>
          {onEditShippingAddress && (
            <CardFooter className="flex justify-between gap-3">
              <Button
                onClick={() => setOnEditShippingAddress(false)}
                variant={"outline"}
                type="button"
                className="w-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </CardFooter>
          )}
        </form>
      )}
    </Card>
  );
}

function SelectShippingAddressDialog({
    selectedAddress,
    addressList,
    onChange,
  }: {
    selectedAddress: AddressModel;
    addressList: Array<AddressModel>;
    onChange: (address: AddressModel) => void;
  }) {
    const [selectedId, setSelectedId] = useState<string>();
  
    const handleChange = (addressId: string) => {
      const address = addressList.find((address) => address._id === addressId);
      address && setSelectedId(address?._id);
    };
  
    const handleSave = () => {
      const selected = addressList.find((address) => address._id === selectedId);
      selected && onChange(selected);
    };
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="w-fit mt-3">
            Change
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80%] md:w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Shipping Address</DialogTitle>
            <DialogDescription>
              Please select your shipping address.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            onValueChange={(value) => handleChange(value)}
            defaultValue={selectedAddress?._id}
            className="w-full"
          >
            <div className="flex flex-col gap-3">
              {addressList.map((address) => (
                <div key={address._id} className="flex w-full space-x-3">
                  <RadioGroupItem
                    value={address._id as string}
                    id={address._id}
                  />
                  <Label htmlFor={address._id} className="w-full">
                    <div className="w-full flex flex-col relative pb-3 border-b font-normal">
                      <span>{`${address.street}`}</span>
                      <span>{`${address.postalCode}, ${address.city}`}</span>
                      <span>{`${address.country}`}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
  
          <DialogFooter>
            <DialogTrigger asChild>
              <Button onClick={handleSave} type="submit">
                Save changes
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
