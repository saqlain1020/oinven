import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "src/hooks/useSxStyles";
import { getCreditsToPay, getCreditsToReceive, getCurrentMonthsData, getTodaysData } from "../actions/product";
import CreditsTable from "src/components/CreditsTable/CreditsTable";

const sxStyles = makeStyles((theme) => ({
  root: {
    color: "red",
  },
}));

export default async function Home() {
  const { profit, todayBought, todaySold, todayCreditPaid, todayCreditReceived } = await getTodaysData();
  const { monthBought, monthSold, monthProfit } = await getCurrentMonthsData();
  const creditsRecevingItems = await getCreditsToReceive();
  const creditsPayItems = await getCreditsToPay();
  return (
    <Box component={"main"}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Todays */}
        <Grid item xs={12}>
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
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Today Credit Paid
            </Typography>
            <Typography fontWeight={600} variant="h6" color="red">
              {todayCreditPaid.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Today Credit Received
            </Typography>
            <Typography fontWeight={600} variant="h6" color="green">
              {todayCreditReceived.toLocaleString()}
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
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey" textAlign="center">
              Month Profit
            </Typography>
            <Typography textAlign="center" color={monthProfit > 0 ? "green" : "red"} fontWeight={600} variant="h6">
              {monthProfit.toLocaleString()}
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





