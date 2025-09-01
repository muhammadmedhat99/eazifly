import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

const TableSkeleton = ({ columns, rows = 6 }: { columns: any[]; rows?: number }) => {
  return (
    <div className="w-full overflow-x-auto px-4 sm:px-0">
      <Table
        removeWrapper
        aria-label="Loading table skeleton"
        dir="rtl"
        classNames={{
          th: "bg-primary/10 text-primary font-bold text-sm first:rounded-s-none last:rounded-e-none first:ps-5 h-[64px]",
          tr: "h-[52px] border-b border-b-stroke",
        }}
      >
        {/* Header Skeleton */}
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.uid} align="start" className="text-start">
              <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
            </TableColumn>
          )}
        </TableHeader>

        {/* Body Skeleton */}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default TableSkeleton;