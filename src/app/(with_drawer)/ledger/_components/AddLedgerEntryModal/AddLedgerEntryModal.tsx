"use client";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { addLedgerEntry } from "src/app/actions/ledger";
import { ILedgerMember } from "../../../../../../lib/models/LedgerMembers";
import { useSWRConfig } from "swr";
import swrKeys from "src/config/swrKeys";

interface Props {
  members: ILedgerMember[];
}

const AddLedgerEntryModal: React.FC<Props> = ({ members }) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [particulars, setParticulars] = useState("");
  const [date, setDate] = useState(moment());
  const [rate, setRate] = useState("");
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("");
  const [memberName, setMemberName] = useState("");

  const handleAdd = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let amount = Number(credit) - Number(debit);
      const memberId = members.find((item) => item.name === memberName)?._id;
      await addLedgerEntry(particulars, rate, amount, date.toString(), memberId, memberName);
      if (memberId) mutate(swrKeys.ledgerMemberEntriesById(memberId));

      setOpen(false);
    } catch (error) {
      alert("Failed to add expense!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset States
    if (!open) {
      setDate(moment());
      setRate("");
      setCredit("");
      setDebit("");
      setParticulars("");
    }
  }, [open]);

  return (
    <Box>
      <Box className="center" sx={{ justifyContent: "flex-end" }}>
        <Button onClick={() => setOpen(true)} variant="outlined">
          Add Entry
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          component={"form"}
          onSubmit={handleAdd}
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: "2px solid #000",
            p: 4,
          }}
          elevation={20}
        >
          <Typography fontWeight="bold" id="modal-modal-title" variant="h5">
            Add Entry
          </Typography>
          <Autocomplete
            freeSolo
            options={members.map((item) => item.name)}
            value={memberName}
            fullWidth
            renderInput={(params) => <TextField required {...params} onChange={(e) => setMemberName(e.target.value)} />}
            onChange={(_, v) => {
              setMemberName(v || "");
            }}
          />
          <TextField
            label="Particulars"
            required
            fullWidth
            sx={{ mt: 2 }}
            value={particulars}
            onChange={(e) => setParticulars(e.target.value)}
          />
          <TextField
            label="Rate"
            type="number"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            sx={{ mt: 2 }}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <TextField
            label="Debit"
            type="number"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            sx={{ mt: 2 }}
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
          />
          <TextField
            label="Credit"
            type="number"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            sx={{ mt: 2 }}
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
          <DatePicker
            label="Date"
            sx={{ width: "100%", mt: 2 }}
            value={date}
            onChange={(v) => setDate(v || moment())}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Close
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              loadingPosition="start"
              variant="contained"
              sx={{ width: 100 }}
            >
              Add
            </LoadingButton>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default AddLedgerEntryModal;
