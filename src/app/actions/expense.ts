"use server";

import Expense from "../../../lib/models/Expense";
import { revalidatePath } from "next/cache";

export const addExpense = async (reason: string, date: string, amount: number) => {
  console.log("reason, date, amount =>", reason, date, amount);
  await Expense.create({ reason, date, amount });
  revalidatePath("/");
};

export const getExpenses = async () => {
  const res = await Expense.find().lean();
  return res.map((item) => ({ ...item, _id: item._id.toString() }));
};

export const deleteExpense = async (_id: string) => {
  await Expense.findOneAndDelete({ _id });
  revalidatePath("/");
};
