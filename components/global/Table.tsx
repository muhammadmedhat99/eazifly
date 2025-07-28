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
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash } from "iconsax-reactjs";

export default function TableComponent({
  columns,
  data,
  ActionsComponent,
  handleRowClick,
  selectable = false,
  setConfirmAction,
  setSelectedItem
}: any) {
  const pathname = usePathname();
  const router = useRouter();

  const renderCell = React.useCallback((item: any, columnKey: any) => {
    const cellValue: string = item[columnKey];

    switch (columnKey) {
      case "avatar":
        return (
          <Avatar
            alt="user avatar"
            radius="full"
            size="sm"
            src={item.avatar}
          />
        );
      case "delete":
        return (
          <button
           onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item); 
              setConfirmAction(true);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash color="red" size="16" />
          </button>
        );


      case "name":
        return (
          <div className="flex flex-col">
            <span className="text-small font-semibold text-start">
              {cellValue}
            </span>
            <span className="text-tiny font-semibold text-start">
              تاريخ الإنشاء : {item.renew_date || item?.created_at}
            </span>
          </div>
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
              className={`size-2 rounded-full bg-${item?.request_type?.color}`}
            ></span>
            <span
              className={`text-${item?.request_type?.color} font-bold`}
            >
              {item?.request_type?.name}
            </span>
          </div>
        );
      
      case "renewal_student_name":
        return (
          <div className="flex items-center gap-2">
            <Chip
            className="capitalize text-center w-10 h-10"
            color={item?.subscription_status?.color}
            variant="flat">
              <span className={`text-${item?.subscription_status?.color} font-bold text-xs`}>
                {item.subscription_status?.name || "منتهي"}
              </span>
            </Chip>
            <div className="flex flex-col items-start">
              <span className="text-[#272727] text-sm font-bold">{item.renewal_student_name}</span>
              {item.subscripe_date && (
                <span className="text-[#5E5E5E] text-sm font-semibold">
                  تاريخ الإلتحاق : {item.subscripe_date}
                </span>
              )}
            </div>

          </div>
        );

      case "contact_info":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-[#272727] text-sm font-bold">
              {item.contact_info?.phone}
            </span>
            <span className="text-[#5E5E5E] text-sm font-semibold">
              {item.contact_info?.email}
            </span>
          </div>
        );
      
      case "last_contact_days":
        return (
            <span className="text-sm font-semibold text-light">
              قبل {item.last_contact_days} يوم
            </span>
        );
      
      case "actions":
        return (
          <React.Fragment>
            <ActionsComponent id={item.id} />
          </React.Fragment>
        );

      default:
        return <React.Fragment>{cellValue}</React.Fragment>;
    }
  }, []);

  return (
    <div className="w-full overflow-x-auto px-4 sm:px-0">
      <Table
      {...(selectable && { selectionMode: "multiple" })}
      removeWrapper
      aria-label="Example table with custom cells"
      dir="rtl"
      classNames={{
        th: "bg-primary/10 text-primary font-bold text-sm first:rounded-s-none last:rounded-e-none first:ps-5 h-[64px]",
        tr: "h-[52px] border-b border-b-stroke",
      }}
    >
      <TableHeader columns={columns} className="bg-primary">
        {(column: any) => (
          <TableColumn
            key={column.uid}
            align="start" 
            className="text-start"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item: any) => (
          <TableRow 
          key={item.id} 
          onClick={() => typeof handleRowClick === "function" ? handleRowClick(item) : router.push(`${pathname}/${item?.id}`)} 
          className={"cursor-pointer"}>
            {(columnKey) => (
              <TableCell className="text-sm font-semibold text-light">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}
