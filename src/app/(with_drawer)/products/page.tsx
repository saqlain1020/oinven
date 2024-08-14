import { Box, Button, Typography } from "@mui/material";
import { getInventory } from "../../actions/product";
import InventoryTable from "src/components/InventoryTable/InventoryTable";
import Link from "next/link";

export default async function Products() {
  const items = await getInventory();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" fontWeight={"bold"}>
          Inventory
        </Typography>
        <Button LinkComponent={Link} href="/products/add" variant="outlined">
          Add Product
        </Button>
      </Box>
      <Box>
        <InventoryTable data={items} />
      </Box>
    </Box>
  );
}
