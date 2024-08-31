const swrKeys = {
  ledgerMemberEntries: () => ["api", "ledger"],
  ledgerMemberEntriesById: (memberId: string) => ["api", "ledger", memberId],
};

export default swrKeys;
