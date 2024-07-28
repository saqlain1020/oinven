import { Box, Button } from "@mui/material";
import { getProducts } from "../actions/product";

export default async function Test() {
  const data = await getProducts();
  console.log("data =>", data);

  return (
    <Box>
      <Button> Fetch Prods</Button>
    </Box>
  );
}
