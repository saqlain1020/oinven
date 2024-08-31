import mongoose, { Model, Document } from "mongoose";

export interface ILedgerMember extends Document {
  particulars: string;
  name: string;
  lastAmount: number;
  balance: number;
  _id: string;
}

const ledgerMemberSchema = new mongoose.Schema<ILedgerMember>(
  {
    particulars: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    lastAmount: {
      type: Number,
    },
    balance: {
      type: Number,
      default: 0,
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

const LedgerMember: Model<ILedgerMember> =
  mongoose.models.LedgerMember || mongoose.model<ILedgerMember>("LedgerMember", ledgerMemberSchema);

export default LedgerMember;
