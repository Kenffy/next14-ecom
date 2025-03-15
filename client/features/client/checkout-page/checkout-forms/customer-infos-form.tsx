import React, { FC, useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { CircleUser, Edit, Mail, Phone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import SelectTitle from './select-title';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomerInfoFormProps {
}

export const CustomerInfoForm: FC<CustomerInfoFormProps> = (props) => {
    const [onEditPersonalInfo, setOnEditPersonalInfo] = useState<boolean>(false);
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <Card className=" w-full md:w-[90%]">
      <CardHeader>
        <CardTitle className="text-2xl">Personal Informations</CardTitle>
        <CardDescription>
          Provide your personal informations here.
        </CardDescription>
      </CardHeader>

      {!onEditPersonalInfo ? (
        <CardContent>
          <div className="flex flex-col relative">
            <span className="flex items-center gap-3">
              <CircleUser size={16} />
              {`Mr Klaus, Mustermann`}
            </span>
            <span className="flex items-center gap-3">
              <Mail size={16} />
              {`klaus.mustermann@test.com`}
            </span>
            <span className="flex items-center gap-3">
              <Phone size={16} />
              {`+49 1234567890`}
            </span>
            <Edit
              size={16}
              onClick={() => setOnEditPersonalInfo(true)}
              className="absolute cursor-pointer top-0 right-0"
            />
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit} className="">
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label>Select Title*</Label>
                <SelectTitle />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 gap-2">
                  <Label>Lastname*</Label>
                  <Input type="text" name="lastname" placeholder="Lastname" required/>
                </div>
                <div className="flex-1 gap-2">
                  <Label>Firstname*</Label>
                  <Input type="text" name="firstname" placeholder="Firstname" required/>
                </div>
              </div>
              <div className="flex-1 gap-2">
                <Label>Email*</Label>
                <Input type="email" name="email" placeholder="Email" required/>
              </div>
              <div className="flex-1 gap-2">
                <Label>Phone Number</Label>
                <Input type="text" name="phone" placeholder="Phone Number (optional)" />
              </div>
            </div>
          </CardContent>
          {onEditPersonalInfo && (
            <CardFooter className="flex justify-between gap-3">
              <Button
                onClick={() => setOnEditPersonalInfo(false)}
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
  )
}
