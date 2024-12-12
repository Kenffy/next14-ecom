'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Hero, HeroButton } from "@/components/ui/hero";
import { Boxes, Group } from "lucide-react";
import { CategoriesTable } from "./categories-table";
import { CategoryModel } from "@/schemas/models";
import { adminCategoryStore } from "./admin-categories-store";
import { UpsertCategory } from "./admin-upsert-category";
import { CustomHero } from "@/components/CustomHero";

interface AdminCategoriesProps {
  categories: Array<CategoryModel>;
}

export const AdminCategories: FC<AdminCategoriesProps> = (props) => {

  useEffect(() => {
    adminCategoryStore.initAdminCategorySession({
      categories: props.categories,
    });
  }, [props.categories]);

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <CustomHero
          title={
            <>
              <Boxes size={26} strokeWidth={1.5} /> Categories
            </>
          }
          actionTitle="Add Category"
          description="Manage categories."
          actionDescription="Add a new category."
          actionIcon={<Group />}
          onClick={() => adminCategoryStore.addCategory()}
        />
        <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
          <CategoriesTable />
        </div>
        <UpsertCategory />
      </main>
    </ScrollArea>

  )
}
