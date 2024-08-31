import { Box } from "@mui/material";
import AddLedgerEntryModal from "./_components/AddLedgerEntryModal/AddLedgerEntryModal";
import { getLedgerMembers } from "src/app/actions/ledger";
import MainLedgerContent from "./_components/MainLedgerContent/MainLedgerContent";

export default async function Page() {
  const members = await getLedgerMembers();
  return (
    <Box>
      {/* @ts-ignore */}
      <AddLedgerEntryModal members={members} />
      {/* @ts-ignore */}
      <MainLedgerContent members={members} />
    </Box>
  );
}
