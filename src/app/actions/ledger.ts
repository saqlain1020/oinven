"use server";

import Ledger from "../../../lib/models/Ledger";
import { revalidatePath } from "next/cache";

export const addLedgerEntry = async (
  particulars: string,
  rate: string,
  credit: number,
  debit: number,
  date: string
) => {
  await Ledger.create({ particulars, rate, credit, debit, date });
  revalidatePath("/ledger");
};

export const getLedger = async () => {
  const res = await Ledger.aggregate([
    {
      $sort: {
        date: 1,
      },
    },
    {
      $setWindowFields: {
        sortBy: {
          date: 1,
        },
        output: {
          balance: {
            $sum: {
              $subtract: ["$credit", "$debit"],
            },
            window: {
              documents: ["unbounded", "current"],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        credit: 1,
        debit: 1,
        date: 1,
        balance: 1,
        particulars: 1,
        rate: 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]);
  return res.map((item) => ({ ...item, _id: item._id.toString() }));
};

export const deleteLedgerEntry = async (_id: string) => {
  await Ledger.findOneAndDelete({ _id });
  revalidatePath("/ledger");
};
