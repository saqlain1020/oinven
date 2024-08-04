import mongoose, { Model, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  nic: string;
  phone: string;
  _id: string;
}

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    name: {
      type: String,
    },
    nic: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
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

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
