import { Box, Container, Typography } from "@mui/material";
import { getProducts } from "../actions/product";
import ProductsTable from "src/components/ProductsTable/ProductsTable";

export default async function Products() {
  const items = await getProducts();
  return (
    <Box>
      <Typography variant="h4" fontWeight={"bold"}>
        Products
      </Typography>
      <ProductsTable data={items} />

      {/* {items.map((item, i) => (
          <Typography key={i}>{item.name}</Typography>
        ))} */}
    </Box>
  );
}
