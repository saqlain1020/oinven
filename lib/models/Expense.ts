import mongoose, { Model, Document } from "mongoose";

export interface IExpense extends Document {
  reason: string;
  date: Date;
  amount: number;
  _id: string;
}

const expenseSchema = new mongoose.Schema<IExpense>(
  {
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: true,
    strict: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>("Expense", expenseSchema);

export default Expense;
