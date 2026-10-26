import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { getProduct } from "src/app/actions/product";
import { makeStyles } from "src/hooks/useSxStyles";
import PaymentsSummary from "../../_components/PaymentsSummary";

const sxStyles = makeStyles((theme) => ({
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    mb: 1,
  },
  itemContentRow: {
    display: "grid",
    gridTemplateColumns: "5fr 1fr 2fr 2fr",
    p: 1,
    px: 4,
    pt: 2,
    pb: 0,
  },
}));

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  let paidAmount = product.buyPayments.reduce((acc, curr) => acc + curr.amount, 0);
  return (
    <Box sx={{ background: "white" }}>
      <Container
        sx={{ py: 2, minHeight: "100dvh", display: "flex", flexFlow: "column", justifyContent: "space-between" }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ mt: 1 }}>
              <Typography color="#8C5A32" variant="h4" fontWeight={"bold"}>
                Prime Tech
              </Typography>
              <Typography color="GrayText">Phone: 0306-2217011</Typography>
            </Box>
            <Box>
              <Typography textAlign="center" color="rgba(58,58,58)" variant="h3">
                INVOICE
              </Typography>
              <Typography color="GrayText" variant="h6" textAlign={"right"}>
                # BUY
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography color="GrayText" variant="h6">
                Bill To:{" "}
                <Typography fontWeight="bold" component="b" color="rgb(58,58,58)">
                  {product.boughtFrom?.name}
                </Typography>
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Typography color="GrayText">NIC:</Typography>
                <Typography fontWeight={"bold"} sx={{ ml: 3.5 }}>
                  {product.boughtFrom?.nic}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography color="GrayText">Phone:</Typography>
                <Typography fontWeight={"bold"} sx={{ ml: 1 }}>
                  {product.boughtFrom?.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={sxStyles.row}>
                <Typography textAlign="right" color="GrayText">
                  Date
                </Typography>
                <Typography textAlign="right" sx={{ pr: 2 }}>
                  {moment(product.boughtAt).format("DD-MMM-YYYY")}
                </Typography>
              </Box>
              <Box sx={[sxStyles.row, { background: "rgba(140,90,50,0.12)", borderRadius: 2, p: 1, pr: 2 }]}>
                <Typography textAlign="right" variant="h6" fontWeight="bold">
                  Balance Due:
                </Typography>
                <Typography textAlign="right" variant="h6" fontWeight={700}>
                  PKR {(product.buyPrice - paidAmount).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr 2fr 2fr",
              background: "#3B2416",
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
          <Box sx={sxStyles.itemContentRow}>
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
              <Typography textAlign={"right"}>Rs {product.buyPrice.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography textAlign={"right"}>Rs {product.buyPrice.toLocaleString()}</Typography>
            </Box>
          </Box>
          <Divider variant="light" sx={{ width: "90%", mx: "auto", mt: 2 }} />
          <PaymentsSummary payments={product.buyPayments} total={product.buyPrice} />
        </Box>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              {/* <Typography color="GrayText" sx={{ mt: 1 }}>
                Terms:
              </Typography>
              <Typography color="rgb(58,58,58)">
                No warranty of camera, touch, and lcd after leaving counter.
              </Typography> */}
            </Box>

            <Box sx={{ position: "relative", ml: "auto", mt: 5, width: "15em" }}>
              <Box sx={{ borderBottom: "1px solid black" }} />
              <Typography fontWeight="bold" textAlign="center">
                Stamp
              </Typography>
            </Box>
          </Box>
          <Typography
            color="rgb(58,58,58)"
            fontWeight={"bold"}
            align="center"
            sx={{
              borderRadius: 4,
              px: 2,
              py: 1,
              mt: 2,
              // width: "max-content",
              background: "rgba(140,90,50,0.12)",
            }}
          >
            Shop # F-50, Prime Tech, Amma Tower Saddar, Karachi | Phone: 0306-2217011
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
