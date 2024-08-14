import { Box, Container, Typography } from "@mui/material";
import { getCreditsToReceive, getProducts } from "../../actions/product";
import ProductsTable from "src/components/ProductsTable/ProductsTable";
import CreditsTable from "src/components/CreditsTable/CreditsTable";

export default async function Products() {
  const items = await getProducts();
  return (
    <Box>
      <Typography variant="h4" fontWeight={"bold"}>
        Products
      </Typography>
      <Box>
        <ProductsTable data={items} />
      </Box>
      <Typography variant="h5" sx={{ mt: 2 }} fontWeight={"bold"}>
        Credits to receive
      </Typography>

      {/* {items.map((item, i) => (
          <Typography key={i}>{item.name}</Typography>
        ))} */}
    </Box>
  );
}
