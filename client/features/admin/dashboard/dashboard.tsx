"use client"

import { SidebarInset } from "@/components/ui/sidebar";
import { CategoryModel, ProductModel, UserModel } from "@/schemas/models";
import { FC, useEffect } from "react";
import { adminStore } from "../admin-store";

interface DashboardProps {
    users: Array<UserModel>;
    products: Array<ProductModel>;
    categories: Array<CategoryModel>;
}

export const Dashboard: FC<DashboardProps> = (props) => {

    useEffect(() => {
        adminStore.initAdminSession({
            users: props.users,
            products: props.products,
            categories: props.categories,
        });
    }, [props.users, props.products, props.categories]);

    return (
        <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="aspect-video text-2xl font-semibold rounded-xl bg-muted/50 p-4">
                        <h3>{props.products.length} Products</h3>
                    </div>
                    <div className="aspect-video text-2xl font-semibold rounded-xl bg-muted/50 p-4">
                        <h3>{props.categories.length} Categories</h3></div>
                    <div className="aspect-video text-2xl font-semibold rounded-xl bg-muted/50 p-4">
                        <h3>{props.users.length} Users</h3></div>
                    <div className="aspect-video text-2xl font-semibold rounded-xl bg-muted/50 p-4">
                        {"4 Orders"}
                    </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
                    Latest transactions
                </div>
            </div>
        </SidebarInset>
    );
};
