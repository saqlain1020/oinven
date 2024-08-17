"use client";
import { Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { ILedger } from "../../../../../../lib/models/Ledger";
import { deleteLedgerEntry } from "src/app/actions/ledger";

const data = [
  {
    _id: "1",
    date: new Date(),
    credit: 0,
    debit: 0,
    particulars: "",
    rate: 0,
  },
];

const LedgerTable: React.FC<{ data: ILedger[] }> = ({ data }) => {
  return (
    <DataGrid
      sx={{ minHeight: 300, mt: 2 }}
      disableColumnFilter
      disableDensitySelector
      getRowId={(row) => row._id}
      // @ts-ignore
      rows={data}
      columns={[
        {
          headerName: "Date",
          field: "date",
          flex: 1,
          maxWidth: 160,
          valueGetter(_, row) {
            return new Date(row.date).getTime();
          },
          renderCell(params) {
            return (
              <Box className="center" sx={{ height: "100%", justifyContent: "flex-start" }}>
                <Tooltip placement="top" title={moment(params.value).format("DD-MMM-YYYY")}>
                  <Typography sx={{ fontSize: 14 }}>{moment(params.value).format("DD-MMM-YYYY")}</Typography>
                </Tooltip>
              </Box>
            );
          },
        },
        {
          headerName: "Particulars",
          field: "particulars",
          flex: 1,
        },
        {
          headerName: "Debit",
          field: "debit",
          flex: 1,
          maxWidth: 150,
        },
        {
          headerName: "Credit",
          field: "credit",
          flex: 1,
          maxWidth: 150,
        },
        {
          headerName: "Balance",
          field: "balance",
          flex: 1,
          maxWidth: 200,
        },
        {
          headerName: "Actions",
          field: "",
          width: 100,
          align: "center",
          renderCell(params) {
            return (
              <Box>
                <IconButton size="small" onClick={() => deleteLedgerEntry(params.row._id)}>
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
  );
};

export default LedgerTable;
