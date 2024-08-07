import { Box, Container, Grid, Typography } from "@mui/material";
import moment from "moment";
import { getProduct } from "src/app/actions/product";
import { makeStyles } from "src/hooks/useSxStyles";
import type { Metadata } from "next";

const sxStyles = makeStyles((theme) => ({
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    mb: 1,
  },
}));

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return (
    <>
      <Box sx={{ background: "white" }}>
        <Container sx={{ py: 2, minHeight: "100dvh" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography textAlign="center" color="rgba(0,0,0,0.8)" variant="h5" fontWeight={"bold"} sx={{ mt: 1 }}>
              Osama Enterprises
            </Typography>
            <Box>
              <Typography textAlign="center" color="rgba(58,58,58)" variant="h3">
                INVOICE
              </Typography>
              <Typography color="GrayText" variant="h6" textAlign={"right"}>
                # SELL
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography color="GrayText" variant="h6">
                Bill To:
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Typography color="GrayText">NIC:</Typography>
                <Typography fontWeight={"bold"} sx={{ ml: 3.5 }}>
                  {product.soldTo?.nic}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography color="GrayText">Phone:</Typography>
                <Typography fontWeight={"bold"} sx={{ ml: 1 }}>
                  {product.soldTo?.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={sxStyles.row}>
                <Typography textAlign="right" color="GrayText">
                  Date
                </Typography>
                <Typography textAlign="right" sx={{ pr: 2 }}>
                  {moment(product.soldAt).format("DD-MMM-YYYY")}
                </Typography>
              </Box>
              <Box sx={sxStyles.row}>
                <Typography textAlign="right" color="GrayText">
                  Payment Terms:
                </Typography>
                <Typography textAlign="right" sx={{ pr: 2 }}>
                  Cash
                </Typography>
              </Box>
              <Box sx={[sxStyles.row, { background: "rgba(0,0,0,0.1)", borderRadius: 2, p: 1, pr: 2 }]}>
                <Typography textAlign="right" variant="h6" fontWeight="bold">
                  Balance Due:
                </Typography>
                <Typography textAlign="right" variant="h6" fontWeight={700}>
                  PKR 0.00
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr 2fr 2fr",
              background: "rgb(58,58,58)",
              color: "white",
              p: 1,
              px: 4,
              mt: 2,
              borderRadius: 2,
            }}
          >
            <Typography>Item</Typography>
            <Typography textAlign="center">Quantity</Typography>
            <Typography textAlign="right">Rate</Typography>
            <Typography textAlign="right">Amount</Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr 2fr 2fr",
              p: 1,
              px: 4,
              pt: 2,
            }}
          >
            <Box>
              <Typography textAlign={"left"} color="rgb(58,58,58)" fontWeight="bold">
                {product.name}
              </Typography>
              {product.attributes.map((item, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1, ml: 2 }}>
                  <Box sx={{ width: 5, height: 5, borderRadius: 360, background: "grey" }} />
                  <Typography color="GrayText">{item.name}:</Typography>
                  <Typography>{item.value}</Typography>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography textAlign={"center"}>1</Typography>
            </Box>
            <Box>
              <Typography textAlign={"right"}>Rs {product.sellPrice.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography textAlign={"right"}>Rs {product.sellPrice.toLocaleString()}</Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: 6 }}>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <Box sx={sxStyles.row}>
                <Typography textAlign="right" color="GrayText">
                  Total:
                </Typography>
                <Typography textAlign="right" sx={{ pr: 2 }}>
                  Rs {product.sellPrice.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={sxStyles.row}>
                <Typography textAlign="right" color="GrayText">
                  Amount Paid:
                </Typography>
                <Typography textAlign="right" sx={{ pr: 2 }}>
                  Rs {product.sellPrice.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography color="GrayText" sx={{ mt: 1 }}>
            Terms:
          </Typography>
          <Typography color="rgb(58,58,58)">No warranty of camera, touch, and lcd after leaving counter.</Typography>

          {/* <Box sx={{ position: "absolute", bottom: 50, right: 50, width: 300 }}>
          <Box sx={{ borderBottom: "1px solid black" }} />
          <Typography variant="h6" fontWeight="bold" textAlign="center">
          Signature
          </Typography>
          </Box>  */}
        </Container>
      </Box>
    </>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // read route params
  const product = await getProduct(params.id);

  return {
    title: `Sale Receipt - ${product.name}`,
    description: `${product.name} sale receipt for Rs ${product.sellPrice}`,
  };
}
