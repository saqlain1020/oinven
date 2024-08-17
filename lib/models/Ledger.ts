import mongoose, { Model, Document } from "mongoose";

export interface ILedger extends Document {
  date: Date;
  rate: number;
  credit: number;
  debit: number;
  particulars: string;
  _id: string;
}

const ledgerSchema = new mongoose.Schema<ILedger>(
  {
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
    credit: {
      type: Number,
      required: true,
      default: 0,
    },
    debit: {
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
