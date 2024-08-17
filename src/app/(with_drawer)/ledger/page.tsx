import { Box } from "@mui/material";
import LedgerTable from "./_components/LedgerTable/LedgerTable";
import AddLedgerEntryModal from "./_components/AddLedgerEntryModal/AddLedgerEntryModal";
import { getLedger } from "src/app/actions/ledger";

export default async function Page() {
  const data = await getLedger();
  return (
    <Box>
      <AddLedgerEntryModal />
      <LedgerTable data={data} />
    </Box>
  );
}
