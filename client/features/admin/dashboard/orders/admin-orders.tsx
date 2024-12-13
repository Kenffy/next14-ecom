'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Hero } from "@/components/ui/hero";
import { ListChecks } from "lucide-react";
import OrdersTable from "./orders-table";


interface AdminOrderProps {
    //   orders: Array<OrderModel>;
}

export const AdminOrders: FC<AdminOrderProps> = (props) => {

    //   useEffect(() => {
    //     adminOrderStore.initAdminOrderSession({
    //       orders: props.orders,
    //     });
    //   }, [props.orders]);

    return (
        <ScrollArea className="flex-1">
            <main className="flex flex-1 flex-col">
                <Hero
                    title={
                        <>
                            <ListChecks size={26} strokeWidth={1.5} /> Orders
                        </>
                    }
                    description={"Manage orders."}
                >
                </Hero>
                <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
                    <OrdersTable />
                </div>
            </main>
        </ScrollArea>

    )
}
