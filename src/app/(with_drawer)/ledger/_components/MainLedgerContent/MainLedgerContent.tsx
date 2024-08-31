"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Delete } from "@mui/icons-material";
import { ILedgerMember } from "../../../../../../lib/models/LedgerMembers";
import { deleteLedgerEntry, getMemberLedgerEntries } from "src/app/actions/ledger";
import useSWR, { useSWRConfig } from "swr";
import moment from "moment";
import swrKeys from "src/config/swrKeys";

interface Props {
  members: ILedgerMember[];
}

const MainLedgerContent: React.FC<Props> = ({ members }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", p: 2, pr: 6, pb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: 11, width: "25%", flexShrink: 0 }}>
          Name
        </Typography>
        <Typography variant="h6" sx={{ fontSize: 11, width: "50%" }}>
          Particular
        </Typography>
        <Typography variant="h6" sx={{ fontSize: 11, width: "25%" }}>
          Balance
        </Typography>
      </Box>
      {members.map((item, i) => (
        <Row {...item} key={i} />
      ))}
    </Box>
  );
};

const Row: React.FC<{
  particulars: string;
  name: string;
  lastAmount: number;
  balance: number;
  _id: string;
}> = ({ _id, balance, lastAmount, name, particulars }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ width: "25%", flexShrink: 0 }}>{name}</Typography>
        {/* Last transaction particulars */}
        <Typography sx={{ width: "50%", color: "text.secondary" }}>{particulars}</Typography>
        {/* Current Balance */}
        <Typography sx={{ width: "25%", color: balance < 0 ? "red" : "green" }}>
          {Math.abs(balance).toLocaleString()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AccordionContent _id={_id} />
      </AccordionDetails>
    </Accordion>
  );
};

const AccordionContent = ({ _id }: { _id: string }) => {
  const { data, error, mutate, isLoading, isValidating } = useSWR(swrKeys.ledgerMemberEntriesById(_id), () =>
    getMemberLedgerEntries(_id)
  );
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Particulars</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell width={40}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6}>
                <LinearProgress sx={{ my: 1 }} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            data?.map((item, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Tooltip placement="top" title={moment(item.date).fromNow()}>
                    <Typography sx={{ fontSize: 14 }}>{moment(item.date).format("DD-MMM-YYYY")}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{item.particulars}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell sx={{ color: item.amount < 0 ? "red" : "green" }}>
                  {Math.abs(item.amount).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: item.balance < 0 ? "red" : "green" }}>
                  {Math.abs(item.balance).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={async () => {
                      await deleteLedgerEntry(item._id);
                      mutate();
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainLedgerContent;
