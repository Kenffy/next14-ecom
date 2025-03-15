import { Card } from "@/components/ui/card";

export default function page() {
  return (
    <Card className="mt-10 flex flex-col gap-10 max-w-screen-sm w-full mx-auto">
      <div className={`border rounded-md p-6 flex flex-col gap-4`}>
        <div className=" mt-4 flex flex-col gap-6">
          <h2 className=" text-center text-4xl font-bold">
            Thank you for your order
          </h2>
          <p className=" text-center">Order successfull completed</p>
        </div>
      </div>
    </Card>
  );
}
