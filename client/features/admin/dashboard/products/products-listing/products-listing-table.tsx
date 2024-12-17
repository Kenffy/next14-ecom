"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingIndicator } from "@/components/ui/loading";
import { format } from "date-fns";
import { FileModel, ProductModel, VariantModel } from "@/schemas/models";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  adminListingStore,
  useAdminListingState,
} from "./products-listing-store";
import { UpdateProductVariantSettings } from "./products-listing-service";

interface AdminProductListingTableProps {
  products: ProductModel[];
}

export const columns: ColumnDef<VariantModel>[] = [
  {
    id: "images",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original as VariantModel;
      const productImageUrl: string = product.images && product.images?.length > 0
        ? product.images[0].url
        : "/images/products/product-default.png";

      return (
        <div className="h-20 w-20">
          <Image
            className="h-full w-full object-cover overflow-hidden rounded-sm"
            height={50}
            width={50}
            src={productImageUrl}
            alt="product variant"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sku
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase break-all line-clamp-2">
        {row.getValue("sku")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase break-all line-clamp-2">
        {row.getValue("price")}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const quantity = product.inventory.quantity;
      return (
        <div className="lowercase break-all line-clamp-2">
          {quantity}
        </div>
      )
    },
  },
  {
    accessorKey: "deleted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {!row.getValue("deleted") ? (
          <span className=" text-green-400">active</span>
        ) : (
          <span className=" text-red-500">inactive</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const productVariant = row.original;

      const { isLoading, handleAction } = useDropdownAction({ productVariant });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              {isLoading ? (
                <LoadingIndicator isLoading={isLoading} />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={async () => await handleAction("edit")}>
              Edit Product Variant
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => await handleAction("disable")}
            >
              {productVariant.deleted
                ? "Restore Product Variant"
                : "Delete Product Variant"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type DropdownAction = "edit" | "disable";

const useDropdownAction = (props: { productVariant: VariantModel }) => {
  const { productVariant } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAction = async (action: DropdownAction) => {
    setIsLoading(true);
    switch (action) {
      case "disable":
        const message = `Are you sure you want to ${productVariant.deleted ? "Restore" : "Delete"
          } this product?`;
        if (window.confirm(message)) {
          await UpdateProductVariantSettings({
            product: {
              ...productVariant,
              deleted: !productVariant.deleted,
            },
          });
        }
        break;
      case "edit":
        adminListingStore.updateProductVariant(productVariant);
        break;
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    handleAction,
  };
};

export function ProductListingTable() {
  const { productVariants } = useAdminListingState();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: productVariants as Array<VariantModel>,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const numberOfVariants = productVariants.length;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-3">{numberOfVariants <= 1 ? `${numberOfVariants} Product Variant` : `${numberOfVariants} Product Variants`}</h2>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("sku")?.setFilterValue(event.target.value)
          }
          className="w-[300px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {`Page ${pagination.pageIndex + 1} - ${table.getPageCount()}`}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
