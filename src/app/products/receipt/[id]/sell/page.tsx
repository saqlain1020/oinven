import { Box, Container, Divider, Typography } from "@mui/material";
import moment from "moment";
import { getProduct } from "src/app/actions/product";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return (
    <Box sx={{ background: "white" }}>
      <Container sx={{ py: 2, minHeight: "100dvh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography textAlign="center" color="rgba(0,0,0,0.8)" variant="h5" fontWeight={"bold"}>
            Osama Enterprises
          </Typography>
          <Typography textAlign="center" color="rgba(0,0,0,0.8)" variant="h6" fontWeight={"bold"}>
            INVOICE
          </Typography>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ mt: 3 }}>
          <b>Sell Date:</b> {moment(product.soldAt).format("DD-MMM-YYYY")}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <b>Phone:</b> {product.soldTo?.phone}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <b>NIC:</b> {product.soldTo?.nic}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            mt: 3,
            borderTop: "2px solid black",
            borderBottom: "2px solid black",
            p: 1,
          }}
        >
          <Typography textAlign={"center"} fontWeight="bold">
            DESCRIPTION
          </Typography>
          <Typography textAlign={"center"} fontWeight="bold" sx={{ borderLeft: "2px solid black" }}>
            AMOUNT
          </Typography>
        </Box>
        <Box sx={{ p: 2, pb: 0, borderLeft: "2px solid grey", borderRight: "2px solid grey", mt: 1 }}>
          <Typography className="boldTagLight">
            <b>Product Name:</b> {product.name}
          </Typography>
          {product.attributes.map((item, i) => (
            <Typography sx={{ mt: 1 }} key={i} className="boldTagLight">
              <b>{item.name}:</b> {item.value}
            </Typography>
          ))}
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ display: "flex", mt: 2, justifyContent: "flex-end" }}>
            <Typography variant="h4">
              <b>Total:</b> {product.sellPrice.toLocaleString()} RS
            </Typography>
          </Box>
        </Box>
        <Box sx={{ borderBottom: "2px solid grey", mt: 1 }} />

        <Box sx={{ position: "absolute", bottom: 50, right: 50, width: 300 }}>
          <Box sx={{ borderBottom: "1px solid black" }} />
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Signature
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
