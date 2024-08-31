import mongoose, { Model, Document } from "mongoose";
import LedgerMember from "./LedgerMembers";

export interface ILedger extends Document {
  date: Date;
  rate: number;
  amount: number;
  balance: number;
  particulars: string;
  member: mongoose.Schema.Types.ObjectId;
  _id: string;
}

const ledgerSchema = new mongoose.Schema<ILedger>(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: LedgerMember,
      index: true,
      required: true,
    },
    particulars: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    rate: {
      type: Number,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
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

const Ledger: Model<ILedger> = mongoose.models.Ledger || mongoose.model<ILedger>("Ledger", ledgerSchema);

export default Ledger;
