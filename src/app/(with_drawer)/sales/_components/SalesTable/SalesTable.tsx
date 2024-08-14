"use client";
import React, { useMemo } from "react";
import { IProductPopulated } from "../../../../../../lib/models/Product";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import moment from "moment";

const columns: GridColDef<IProductPopulated>[] = [
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
    valueFormatter: (v: string) => (v ? moment(v).fromNow() : "-"),
    flex: 1,
    renderCell(params) {
      return (
        <Box className="center" sx={{ height: "100%", justifyContent: "flex-start" }}>
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
        <Box className="center" sx={{ height: "100%", justifyContent: "flex-start" }}>
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
const SalesTable: React.FC<{ data: IProductPopulated[] }> = ({ data }) => {
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
    <Box>
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
              return (
                <Box>
                  <IconButton size="small" onClick={() => router.push(`products/edit/${params.row._id}`)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
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

export default SalesTable;
