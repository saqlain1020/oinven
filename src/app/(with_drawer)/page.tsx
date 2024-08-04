import { Box, Card, Grid, Typography } from "@mui/material";
import { makeStyles } from "src/hooks/useSxStyles";
import { generateDashboardData } from "../actions/product";

const sxStyles = makeStyles((theme) => ({
  root: {
    color: "red",
  },
}));

export default async function Home() {
  const data = await generateDashboardData();
  return (
    <Box component={"main"}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
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
              This Month Sold
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.currentMonthSold.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              This Month Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.currentMonthBought.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              This Year Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.currentYearSold.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              This Year Bought
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {data.currentYearBought.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


