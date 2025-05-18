"use client";

import React from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TableComponent({
  columns,
  data,
  ActionsComponent,
}: any) {
  const pathname = usePathname();

  const renderCell = React.useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <Link href={`${pathname}/${item?.id}` || ""}>
            <User
              avatarProps={{ radius: "full", src: item.avatar, size: "sm" }}
              description={
                item.renew_date && (
                  <span className="text-[#5E5E5E] font-semibold text-start">
                    تاريخ الإنشاء : {item.renew_date}
                  </span>
                )
              }
              name={cellValue}
            ></User>
          </Link>
        );

      case "status":
        return (
          <Chip
            className="capitalize px-4 min-w-24 text-center"
            color={item?.status?.color}
            variant="flat"
          >
            <span className={`text-${item?.status?.color} font-bold`}>
              {item?.status?.name}
            </span>
          </Chip>
        );

      case "order_status":
        return (
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full bg-${item?.order_status?.color}`}
            ></span>
            <span className={`text-${item?.order_status?.color} font-bold`}>
              {item?.order_status?.name}
            </span>
          </div>
        );
      case "request_type":
        return (
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full bg-${item?.subscription_status?.color}`}
            ></span>
            <span
              className={`text-${item?.subscription_status?.color} font-bold`}
            >
              {item?.request_type?.name}
            </span>
          </div>
        );
      case "actions":
        return (
          <React.Fragment>
            <ActionsComponent id={item.id} />
          </React.Fragment>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      removeWrapper
      aria-label="Example table with custom cells"
      dir="rtl"
      classNames={{
        th: "bg-primary/10 text-primary font-bold text-sm first:rounded-s-none last:rounded-e-none first:ps-5 h-[64px]",
      }}
    >
      <TableHeader columns={columns} className="bg-primary">
        {(column: any) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="text-xs font-semibold text-light">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
