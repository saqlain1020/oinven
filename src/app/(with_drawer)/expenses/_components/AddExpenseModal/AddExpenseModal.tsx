"use client";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { addExpense } from "src/app/actions/expense";

const AddExpenseModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(moment());
  const [expenseAmount, setExpenseAmount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const handleAdd = async () => {
    setLoading(true);
    try {
      const amount = Number(expenseAmount) - Number(incomeAmount);
      await addExpense(reason, date.toString(), amount);
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
      setExpenseAmount("");
      setIncomeAmount("");
      setReason("");
    }
  }, [open]);
  return (
    <Box>
      <Box className="center" sx={{ justifyContent: "flex-end" }}>
        <Button onClick={() => setOpen(true)} variant="outlined">
          Add Expense
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
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
            Add Expense
          </Typography>
          <TextField
            label="Reason"
            fullWidth
            sx={{ mt: 2 }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <TextField
            label="Expense Amount"
            type="number"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            sx={{ mt: 2 }}
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <TextField
            label="Income Amount"
            type="number"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            sx={{ mt: 2 }}
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
          <DateTimePicker
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
              onClick={handleAdd}
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

export default AddExpenseModal;
