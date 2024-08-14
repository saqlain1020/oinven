import { Box } from "@mui/material";
import { getSales } from "src/app/actions/product";
import SalesTable from "./_components/SalesTable/SalesTable";

export default async function Page() {
  const sales = await getSales();
  return (
    <Box>
      <SalesTable data={sales} />
    </Box>
  );
}
