import { Box, Card, Grid, Typography } from "@mui/material";
import moment from "moment";
import { getProduct } from "src/app/actions/product";

export default async function Page({ params }: { params: { id: string } }) {
  const prod = await getProduct(params.id);
  if (!prod) return <Typography>Product not found!</Typography>;
  return (
    <Box>
      <Typography variant="h4" fontWeight={"bold"}>
        {prod.name}
      </Typography>
      <Typography variant="body2">Category: {prod.category}</Typography>
      <Typography sx={{ mt: 2 }}>{prod.description}</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Bought At
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {prod.boughtAt ? moment(prod.boughtAt).calendar() : "-"}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Buy Price
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {prod.buyPrice ? prod.buyPrice.toLocaleString() : "-"}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Sold At
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {prod.soldAt ? moment(prod.soldAt).calendar() : "-"}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="grey">
              Sell Price
            </Typography>
            <Typography fontWeight={600} variant="h6">
              {prod.sellPrice ? prod.sellPrice.toLocaleString() : "-"}
            </Typography>
          </Card>
        </Grid>
        {prod.attributes.map((item) => (
          <Grid item xs={12} md={6} key={item.name}>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2" color="grey">
                {item.name}
              </Typography>
              <Typography fontWeight={600} variant="h6">
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
