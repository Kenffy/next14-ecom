import React, { FC, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
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
import { PaymentMethods } from '@/data/data';
import { PaymentType } from '@/schemas/models';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentFormProps {
    selectedMethod: PaymentType | null;
    onChange: (address: PaymentType) => void;
}

export const PaymentMethodForm: FC<PaymentFormProps> = (props) => {
    const { selectedMethod, onChange } = props;
  return (
    <Card className="w-full md:w-[90%]">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Methods</CardTitle>
        <CardDescription>Choose your payment method here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col relative pb-3">
          {selectedMethod && (
            <div className="w-full flex items-center gap-3 relative font-normal">
              <img
                src={selectedMethod?.icon}
                className=" h-[40px] w-[100px] border py-1 px-3 rounded-md object-contain"
                alt={selectedMethod?.name}
              />
              <span>{`${selectedMethod?.name}`}</span>
            </div>
          )}

          <SelectPaymentMethodsDialog
            selectedMethod={selectedMethod as PaymentType}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function SelectPaymentMethodsDialog({
    selectedMethod,
    onChange,
  }: {
    selectedMethod: PaymentType;
    onChange: (method: PaymentType) => void;
  }) {
    const [selectedId, setSelectedId] = useState<string>();
  
    const handleChange = (methodId: string) => {
      const method = PaymentMethods.find((method) => method.id === methodId);
      method && setSelectedId(method?.id);
    };
  
    const handleSave = () => {
      const selected = PaymentMethods.find((method) => method.id === selectedId);
      selected && onChange(selected);
    };
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="w-fit mt-3">
            {selectedMethod? "Change": "Select"}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80%] md:w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Payment Method</DialogTitle>
            <DialogDescription>
              Please select your payment method.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            onValueChange={(value) => handleChange(value)}
            defaultValue={selectedMethod?.id}
            className="w-full"
          >
            <div className="flex flex-col gap-3">
              {PaymentMethods.map((method) => (
                <div key={method.id} className="flex items-center w-full space-x-3 pb-3 border-b">
                  <RadioGroupItem disabled={!method.available} value={method.id as string} id={method.id} />
                  <Label htmlFor={method.id} className="w-full">
                    <div className="w-full flex items-center gap-3 relative font-normal">
                      <img
                        src={method.icon}
                        className=" h-[40px] w-[65px] border py-1 px-3 rounded-md object-contain"
                        alt={method.name}
                      />
                      <div className="flex flex-col gap-1">
                      <span>{`${method.name}`}</span>
                      {!method.available && <span className="text-sm text-muted-foreground">{"(Currently not available)"}</span>}
                      </div>
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
