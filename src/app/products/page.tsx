import { Box, Container, Typography } from "@mui/material";
import { getProducts } from "../actions/product";

export default async function Products() {
  const items = await getProducts();
  return (
    <Box>
      <Container>
        <Typography variant="h4" fontWeight={"bold"}>
          Products
        </Typography>
        {items.map((item, i) => (
          <Typography key={i}>{item.name}</Typography>
        ))}
      </Container>
    </Box>
  );
}
