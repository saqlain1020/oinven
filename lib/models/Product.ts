import mongoose, { Model, Document } from "mongoose";
import { ProductCategory } from "src/types/product";
import Customer, { ICustomer } from "./Customer";

export interface IProduct extends Document {
  name: string;
  description?: string;
  category: ProductCategory;
  attributes: { name: string; value: string }[];
  boughtAt: Date;
  soldAt: Date;
  buyPrice: number;
  sellPrice: number;
  createdAt: string;
  soldTo?: mongoose.Schema.Types.ObjectId;
  boughtFrom?: mongoose.Schema.Types.ObjectId;
  updatedAt: string;
  _id: string;
}

export interface IProductPopulated extends Omit<IProduct, "soldTo" | "boughtFrom"> {
  soldTo?: ICustomer;
  boughtFrom?: ICustomer;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      index: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    boughtAt: {
      type: Date,
    },
    buyPrice: {
      type: Number,
    },
    soldAt: {
      type: Date,
    },
    sellPrice: {
      type: Number,
    },
    boughtFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
    },
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
    },
    attributes: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
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

// accountSchema.methods.deleteReferralCode = async function () {
//   const doc = this;
//   doc.referralCode = undefined;
//   doc.save();
// };

// Add a pre find middleware to populate the referrer field
productSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate("soldTo");
  // @ts-ignore
  this.populate("boughtFrom");
  next();
});

// var Product = mongoose.model("Product", productSchema);
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
