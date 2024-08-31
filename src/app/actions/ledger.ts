"use server";

import Ledger from "../../../lib/models/Ledger";
import { revalidatePath } from "next/cache";
import LedgerMember from "../../../lib/models/LedgerMembers";

const modifyBalances = async (ledgerMemberId: string) => {
  const iterator = Ledger.find({ member: ledgerMemberId }).sort("date");
  let balance = 0;
  let particulars = "";
  let lastAmount: number | undefined = undefined;
  for await (const item of iterator) {
    balance += item.amount;
    particulars = item.particulars;
    lastAmount = item.amount;
    if (item.balance !== balance) {
      item.balance = balance;
      await item.save();
    }
  }
  await LedgerMember.findByIdAndUpdate(ledgerMemberId, {
    balance,
    particulars,
    lastAmount,
  });
};

export const addLedgerEntry = async (
  particulars: string,
  rate: string,
  amount: number,
  date: string,
  memberId: string = "",
  memberName: string = ""
) => {
  if (!memberId && memberName) {
    const member = await LedgerMember.create({ name: memberName });
    memberId = member._id;
  }
  await Ledger.create({ particulars, rate, amount, member: memberId, date });
  await modifyBalances(memberId);
  revalidatePath("/ledger");
};

export const getMemberLedgerEntries = async (memberId: string) => {
  const res = await Ledger.find({ member: memberId }).sort("date").lean();
  return res;
};

export const addLedgerMember = async (particulars: string, name: string, lastAmount: number, balance: number) => {
  const mem = await LedgerMember.create({
    particulars,
    name,
    lastAmount,
    balance,
  });
  return mem.toJSON();
};

export const updateLedgerMember = async (
  _id: string,
  particulars: string,
  name: string,
  lastAmount: number,
  balance: number
) => {
  const mem = await LedgerMember.findByIdAndUpdate(
    _id,
    {
      particulars,
      name,
      lastAmount,
      balance,
    },
    { new: true }
  );
  if (!mem) throw new Error("Member don't exist.");
  return mem.toJSON();
};

export const getLedgerMembers = async () => {
  const res = await LedgerMember.find().lean();
  return res.map((item) => ({ ...item, _id: item._id.toString() }));
};

export const deleteLedgerEntry = async (_id: string) => {
  const entry = await Ledger.findOneAndDelete({ _id });
  modifyBalances(entry!.member.toString());
  revalidatePath("/ledger");
};
