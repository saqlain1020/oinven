"use client";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { deleteProduct, getProducts } from "src/app/actions/product";
import moment from "moment";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { IProductPopulated } from "../../../lib/models/Product";

const columns: GridColDef<IProductPopulated>[] = [
  {
    field: "name",
    sortable: true,
    minWidth: 100,
    headerName: "Name",
    flex: 1,
    renderCell(params) {
      let isCreditDue = false;
      const paidAmount = params.row.payments.reduce((acc, item) => acc + item.amount, 0);
      const totalSellPrice = params.row.sellPrice;
      if (totalSellPrice && params.row.payments.length > 0 && paidAmount < totalSellPrice) isCreditDue = true;
      return (
        <Tooltip followCursor placement="top" arrow title={isCreditDue ? "Credit Due" : ""}>
          <Box className="center" sx={{ height: "100%", justifyContent: "flex-start" }}>
            {isCreditDue && <ReportProblemIcon color="warning" fontSize="small" sx={{ mr: 1 }} />}
            <Typography sx={{ fontSize: 14 }}>{params.value}</Typography>
          </Box>
        </Tooltip>
      );
    },
  },
  {
    field: "category",
    sortable: true,
    minWidth: 100,
    headerName: "Category",
    flex: 1,
  },
  {
    field: "boughtAt",
    sortable: true,
    minWidth: 100,
    headerName: "Bought At",
    valueFormatter: (v: string) => (v ? moment(v).fromNow() : "-"),
    flex: 1,
    renderCell(params) {
      return (
        <Box className="center" sx={{ height: "100%" }}>
          <Tooltip placement="top" title={moment(params.value).format("DD-MMM-YYYY")}>
            <Typography sx={{ fontSize: 14 }}>{params.formattedValue}</Typography>
          </Tooltip>
        </Box>
      );
    },
  },
  {
    field: "buyPrice",
    sortable: true,
    cellClassName: "red",
    minWidth: 100,
    headerName: "Buy Price",
    valueFormatter: (v?: number) => (v ? Number(v).toLocaleString() : "-"),
    valueGetter: (v?: number) => (v ? Number(v) : 0),
    flex: 1,
  },
  {
    field: "soldAt",
    sortable: true,
    minWidth: 100,
    headerName: "Sold At",
    valueFormatter: (v: string) => (v ? moment(v).fromNow() : "-"),
    flex: 1,
    renderCell(params) {
      return (
        <Box className="center" sx={{ height: "100%" }}>
          <Tooltip placement="top" title={moment(params.value).format("DD-MMM-YYYY")}>
            <Typography sx={{ fontSize: 14 }}>{params.formattedValue}</Typography>
          </Tooltip>
        </Box>
      );
    },
  },
  {
    field: "sellPrice",
    sortable: true,
    cellClassName: "green",
    minWidth: 100,
    headerName: "Sell Price",
    valueFormatter: (v?: number) => (v ? Number(v).toLocaleString() : "-"),
    valueGetter: (v?: number) => (v ? Number(v) : 0),
    flex: 1,
  },
  {
    field: "imei",
    sortable: true,
    minWidth: 100,
    headerName: "Imei",
    valueFormatter: (v?: any) => (v ? v.slice(0, 3) + "..." + v.slice(-3) : "-"),
    flex: 1,
  },
];

const ProductsTable: React.FC<{ data: Awaited<ReturnType<typeof getProducts>> }> = ({ data }) => {
  const [_, formAction] = useFormState(deleteProduct, null);
  const router = useRouter();

  const rows = useMemo(() => {
    return data.map((item) => {
      const imei = item.attributes.find((item) => item.name.toLowerCase().includes("imei"))?.value;
      const info = imei ? imei : undefined;
      return {
        ...item,
        imei: info,
      };
    });
  }, [data]);

  return (
    <Box sx={{ minHeight: 300, mt: 2 }}>
      <DataGrid
        sx={{ minHeight: 300 }}
        disableColumnFilter
        // disableColumnSelector
        disableDensitySelector
        // checkboxSelection
        // loading
        getRowId={(row) => row._id}
        // onRowClick={(params) => {
        //   router.push(`products/${params.row._id}`);
        // }}
        // @ts-ignore
        rows={rows}
        columns={[
          ...columns,
          {
            headerName: "Actions",
            field: "",
            width: 150,
            align: "center",
            renderCell(params) {
              const isSold = !!params.row.soldAt;
              return (
                <Box>
                  {!isSold && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 0, minHeight: 0 }}
                      onClick={() => router.push(`products/edit/${params.row._id}`)}
                    >
                      Sell
                    </Button>
                  )}
                  <IconButton size="small" onClick={() => router.push(`products/${params.row._id}`)}>
                    <RemoveRedEye fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => router.push(`products/edit/${params.row._id}`)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => formAction(params.row._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              );
            },
          },
        ]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default ProductsTable;
