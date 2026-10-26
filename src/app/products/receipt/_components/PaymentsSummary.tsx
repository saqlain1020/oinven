import { Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import { makeStyles } from "src/hooks/useSxStyles";
import { PaymentType } from "src/types/product";

const sxStyles = makeStyles((theme) => ({
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    mb: 1,
  },
  paymentRow: {
    display: "grid",
    gridTemplateColumns: "6fr 2fr 2fr",
    p: 1,
    px: 4,
    pt: 2,
    pb: 0,
  },
}));

type Payment = { date: Date; amount: number; type: PaymentType; account?: string };

// Lists every installment with the balance left after it, then the totals.
export default function PaymentsSummary({ payments, total }: { payments: Payment[]; total: number }) {
  const sorted = [...payments].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  const paidAmount = sorted.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = total - paidAmount;
  let remaining = total;

  return (
    <>
      {sorted.length > 0 && (
        <Box sx={[sxStyles.paymentRow, { pt: 1 }]}>
          <Typography color="GrayText">Payments</Typography>
          <Typography color="GrayText" textAlign="right">
            Paid
          </Typography>
          <Typography color="GrayText" textAlign="right">
            Remaining
          </Typography>
        </Box>
      )}
      {sorted.map((item, i) => {
        remaining -= item.amount;
        return (
          <Box key={i} sx={sxStyles.paymentRow}>
            <Typography textAlign={"left"} color="rgb(58,58,58)" fontWeight="bold">
              {moment(item.date).format("DD-MMM-YYYY")} | {item.type} {item.account && `(${item.account})`}
            </Typography>
            <Typography textAlign={"right"}>Rs {item.amount.toLocaleString()}</Typography>
            <Typography textAlign={"right"}>Rs {remaining.toLocaleString()}</Typography>
          </Box>
        );
      })}
      <Grid container spacing={2} sx={{ mt: 6 }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Box sx={sxStyles.row}>
            <Typography textAlign="right" color="GrayText">
              Total:
            </Typography>
            <Typography textAlign="right" sx={{ pr: 2 }}>
              Rs {total.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={sxStyles.row}>
            <Typography textAlign="right" color="GrayText">
              Amount Paid:
            </Typography>
            <Typography textAlign="right" sx={{ pr: 2 }}>
              Rs {paidAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={sxStyles.row}>
            <Typography textAlign="right" color="GrayText">
              Remaining:
            </Typography>
            <Typography textAlign="right" fontWeight="bold" sx={{ pr: 2 }}>
              Rs {balance.toLocaleString()}
            </Typography>
          </Box>
          <Typography textAlign="right" fontWeight="bold" color={balance > 0 ? "#8C5A32" : "green"} sx={{ pr: 2 }}>
            {balance > 0 ? `Rs ${balance.toLocaleString()} to be paid later` : "Paid in full"}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
