import { type FactorySalesOrder } from "@/apps/factory/store";
import { type ColumnDef } from "@tanstack/react-table";

export const salesOrderColumns: ColumnDef<FactorySalesOrder>[] = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: "Order #",
    enableHiding: false,
  },
  {
    id: "customerName",
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "poNumber",
    accessorKey: "poNumber",
    header: "PO #",
  },
  {
    id: "total",
    accessorKey: "total",
    header: "Total ($)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "totalExclTax",
    accessorKey: "totalExclTax",
    header: "Total ($) excl. tax",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "createdDate",
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    id: "requiredDate",
    accessorKey: "requiredDate",
    header: "Required Date",
  },
  {
    id: "invoiceStatus",
    accessorKey: "invoiceStatus",
    header: "Invoice Status",
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Payment Status",
  },
  {
    id: "invoicedDate",
    accessorKey: "invoicedDate",
    header: "Invoiced Date",
  },
  {
    id: "invoicedToDate",
    accessorKey: "invoicedToDate",
    header: "Invoiced to Date ($)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "toBeInvoiced",
    accessorKey: "toBeInvoiced",
    header: "To Be Invoiced ($)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "assignedTo",
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    id: "contactName",
    accessorKey: "contactName",
    header: "Contact Name",
  },
  {
    id: "contactEmail",
    accessorKey: "contactEmail",
    header: "Contact Email",
  },
  {
    id: "contactMobile",
    accessorKey: "contactMobile",
    header: "Contact Mobile",
  },
  {
    id: "contactPhone",
    accessorKey: "contactPhone",
    header: "Contact Phone",
  },
  {
    id: "orderType",
    accessorKey: "orderType",
    header: "Order Type",
  },
  {
    id: "cost",
    accessorKey: "cost",
    header: "Cost ($)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "margin",
    accessorKey: "margin",
    header: "Margin ($)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "labourActual",
    accessorKey: "labourActual",
    header: "Labour ($) Actual",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "labourEstimated",
    accessorKey: "labourEstimated",
    header: "Labour ($) Estimated",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "hoursEstimated",
    accessorKey: "hoursEstimated",
    header: "Hours Estimated",
  },
  {
    id: "hoursWorked",
    accessorKey: "hoursWorked",
    header: "Hours Worked",
  },
  {
    id: "deliveryFee",
    accessorKey: "deliveryFee",
    header: "Delivery Fee",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "deliveryAddress",
    accessorKey: "deliveryAddress",
    header: "Delivery Address",
  },
  {
    id: "billingAddress",
    accessorKey: "billingAddress",
    header: "Billing Address",
  },
  {
    id: "installAddress",
    accessorKey: "installAddress",
    header: "Install Address",
  },
  {
    id: "totalLinkedPoCostExclTax",
    accessorKey: "totalLinkedPoCostExclTax",
    header: "Linked PO Cost ($) excl. tax",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
  {
    id: "linkedOrders",
    accessorKey: "linkedOrders",
    header: "Linked Orders",
    cell: ({ getValue }) => {
      const value = getValue<string[]>();
      return value.length > 0 ? value.join(", ") : "—";
    },
  },
  {
    id: "labels",
    accessorKey: "labels",
    header: "Labels",
    cell: ({ getValue }) => {
      const value = getValue<string[]>();
      return value.length > 0 ? value.join(", ") : "—";
    },
  },
  {
    id: "lastModifiedBy",
    accessorKey: "lastModifiedBy",
    header: "Last Modified By",
  },
  {
    id: "lastModifiedDate",
    accessorKey: "lastModifiedDate",
    header: "Last Modified Date",
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "pickUpNotes",
    accessorKey: "pickUpNotes",
    header: "Pick Up Notes",
  },
];
