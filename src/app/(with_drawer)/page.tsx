import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "src/hooks/useSxStyles";
import {
  getCreditsToPay,
  getCreditsToReceive,
  getCurrentMonthsData,
  getCurrentWeekData,
  getTodaysData,
} from "../actions/product";
import CreditsTable from "src/components/CreditsTable/CreditsTable";

const sxStyles = makeStyles((theme) => ({
  root: {
    color: "red",
  },
}));

export default async function Home() {
  const { profit, todayExpense, todayBought, todaySold } = await getTodaysData();
  const { monthBought, monthSold, monthProfit, monthExpense } = await getCurrentMonthsData();
  const { weekBought, weekExpense, weekProfit, weekSold } = await getCurrentWeekData();
  const creditsRecevingItems = await getCreditsToReceive();
  const creditsPayItems = await getCreditsToPay();
  return (
    <Box component={"main"}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Todays */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2 }} elevation={5}>
            <Typography textAlign={"center"} variant="body2" color="grey">
              Today&apos;s Profit
            </Typography>
            <Typography textAlign={"center"} color={profit > 0 ? "green" : "red"} fontWeight={600} variant="h5">
              {profit.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Today Expense
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {todayExpense.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Today Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {todayBought.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Today Sold
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {todaySold.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
            Week Data:-
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Week Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {weekBought.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Week Sold
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {weekSold.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey" textAlign="center">
              Week Profit
            </Typography>
            <Typography textAlign="center" color={weekProfit > 0 ? "green" : "red"} fontWeight={600} variant="h6">
              {weekProfit.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Week Expense
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {weekExpense.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
            Month Data:-
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Month Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {monthBought.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Month Sold
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {monthSold.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey" textAlign="center">
              Month Profit
            </Typography>
            <Typography textAlign="center" color={monthProfit > 0 ? "green" : "red"} fontWeight={600} variant="h6">
              {monthProfit.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Month Expense
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {monthExpense.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
            Credits To Receive:-
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CreditsTable type="sell" data={creditsRecevingItems} />
        </Grid>
        <Grid item xs={12}>
          <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
            Credits To Pay:-
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CreditsTable type="buy" data={creditsPayItems} />
        </Grid>
      </Grid>
    </Box>
  );
}


