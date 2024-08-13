import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "src/hooks/useSxStyles";
import { generateDashboardData, getCurrentMonthsData, getTodaysData } from "../actions/product";

const sxStyles = makeStyles((theme) => ({
  root: {
    color: "red",
  },
}));

export default async function Home() {
  const data = await generateDashboardData();
  const { profit, todayBought, todaySold } = await getTodaysData();
  const { monthBought, monthSold, monthProfit } = await getCurrentMonthsData();
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
            <Typography variant="body2" color="grey">
              Month Profit
            </Typography>
            <Typography color={monthProfit > 0 ? "green" : "red"} fontWeight={600} variant="h6">
              {monthProfit.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Total Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.totalBoughtAmount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Total Sold
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.totalSoldAmount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Total Profit
            </Typography>
            <Typography
              color={data.totalSoldAmount - data.totalBoughtAmount > 0 ? "green" : "red"}
              fontWeight={600}
              variant="h6"
            >
              {(data.totalSoldAmount - data.totalBoughtAmount).toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


