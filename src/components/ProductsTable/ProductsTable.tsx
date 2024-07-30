"use client";
import { Box, IconButton } from "@mui/material";
import React, { useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { deleteProduct, getProducts } from "src/app/actions/product";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const columns = [
  {
    field: "name",
    sortable: true,
    minWidth: 100,
    headerName: "Name",
    flex: 1,
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
    valueFormatter: (v: string) => moment(v).calendar(),
    flex: 1,
  },
  {
    field: "buyPrice",
    sortable: true,
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
    valueFormatter: (v: string) => (v ? moment(v).calendar() : "-"),
    flex: 1,
  },
  {
    field: "sellPrice",
    sortable: true,
    minWidth: 100,
    headerName: "Sell Price",
    valueFormatter: (v?: number) => (v ? Number(v).toLocaleString() : "-"),
    valueGetter: (v?: number) => (v ? Number(v) : 0),
    flex: 1,
  },
  {
    field: "info",
    sortable: true,
    minWidth: 100,
    headerName: "Info",
    valueFormatter: (v?: any) => (v ? v : "-"),
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
        info,
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
        onRowClick={(params) => {
          router.push(`products/${params.row._id}`);
        }}
        rows={rows}
        columns={[
          ...columns,
          {
            headerName: "Actions",
            field: "",
            align: "center",
            renderCell(params) {
              return (
                <IconButton onClick={() => formAction(params.row._id)}>
                  <Delete fontSize="small" />
                </IconButton>
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
