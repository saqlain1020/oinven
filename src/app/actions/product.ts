"use server";

import { redirect } from "next/navigation";
import Product, { IProductPopulated } from "../../../lib/models/Product";
import { revalidatePath } from "next/cache";
import Customer from "../../../lib/models/Customer";
import { AttributesOptions } from "src/types/product";

export async function createOrUpdateProduct(prev: any, formData: FormData) {
  let obj = {
    attributes: [] as { name: string; value: string }[],
    payments: [] as { date: Date; amount: number }[],
  } as {
    attributes: { name: string; value: string }[];
    payments: { date: Date; amount: number }[];
    name: string;
    category: string;
    description?: string;
    buyingPhone?: string;
    buyingNic?: string;
    boughtAt?: string;
    buyPrice?: string;
    sellingPhone?: string;
    sellingNic?: string;
    solAt?: string;
    sellPrice?: string;
    // not in form data
    boughtFrom?: string;
    soldTo?: string;
    // Only if editing
    productId?: string;
  };
  formData.forEach((value, key) => {
    if (key.split(".")[0] === "attributes" || key.split(".")[0] === "payments") {
      const keyName = key.split(".")[0];
      const index = Number(key.split(".")[1]);
      // @ts-ignore
      obj[keyName][index] = {
        // @ts-ignore
        ...obj[keyName][index],
        [key.split(".")[2]]: value,
      };
    } else {
      // @ts-ignore
      obj[key] = value;
    }
  });
  if (obj.buyingNic) {
    let boughtFrom = await Customer.findOne({ nic: obj.buyingNic });
    if (!boughtFrom) {
      boughtFrom = await Customer.create({
        nic: obj.buyingNic,
        phone: obj.buyingPhone,
      });
    }
    obj.boughtFrom = boughtFrom!._id;
  }
  if (obj.sellingNic) {
    let soldTo = await Customer.findOne({ nic: obj.sellingNic });
    if (!soldTo) {
      soldTo = await Customer.create({
        nic: obj.sellingNic,
        phone: obj.sellingPhone,
      });
    }
    obj.soldTo = soldTo!._id;
  }
  if (obj.productId) {
    const product = await Product.findOneAndUpdate({ _id: obj.productId }, obj, { new: true });
    revalidatePath("/products/edit/" + obj.productId);
    return product!.toJSON();
  } else {
    const product = new Product(obj);
    await product.save();
    redirect("/products");
  }
}

export async function deleteProduct(prev: any, _id: string) {
  await Product.findByIdAndDelete(_id);
  revalidatePath("/products");
}

export async function getProduct(_id: string) {
  const prod = await Product.findById(_id);
  return prod?.toJSON() as IProductPopulated;
}

export async function getProducts() {
  const items = await Product.find().sort("-updatedAt").lean();

  return JSON.parse(JSON.stringify(items)) as IProductPopulated[];
}

export async function generateDashboardData() {
  let data: any;
  let result = {
    totalBoughtAmount: 0,
    totalSoldAmount: 0,
    currentMonthBought: 0,
    currentMonthSold: 0,
    currentYearBought: 0,
    currentYearSold: 0,
  };

  data = await Product.aggregate<{
    totalBoughtAmount: number;
    totalSoldAmount: number;
  }>([
    {
      $match: {},
    },
    {
      $group: {
        _id: null,
        totalBoughtAmount: {
          $sum: "$buyPrice",
        },
        totalSoldAmount: {
          $sum: "$sellPrice",
        },
      },
    },
  ]);
  if (data.length > 0) {
    result.totalBoughtAmount = data[0].totalBoughtAmount;
    result.totalSoldAmount = data[0].totalSoldAmount;
  }
  data = await Product.aggregate<{
    totalBoughtAmount: number;
  }>([
    {
      $match: {
        boughtAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalBoughtAmount: {
          $sum: "$buyPrice",
        },
      },
    },
  ]);
  if (data.length > 0) {
    result.currentMonthBought = data[0].totalBoughtAmount;
  }
  data = await Product.aggregate<{
    totalSoldAmount: number;
  }>([
    {
      $match: {
        soldAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSoldAmount: {
          $sum: "$sellPrice",
        },
      },
    },
  ]);
  if (data.length > 0) {
    result.currentMonthSold = data[0].totalSoldAmount;
  }

  data = await Product.aggregate<{
    totalBoughtAmount: number;
  }>([
    {
      $match: {
        boughtAt: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
          $lt: new Date(new Date().getFullYear() + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalBoughtAmount: {
          $sum: "$buyPrice",
        },
      },
    },
  ]);
  if (data.length > 0) {
    result.currentYearBought = data[0].totalBoughtAmount;
  }
  data = await Product.aggregate<{
    totalSoldAmount: number;
  }>([
    {
      $match: {
        soldAt: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
          $lt: new Date(new Date().getFullYear() + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSoldAmount: {
          $sum: "$sellPrice",
        },
      },
    },
  ]);
  if (data.length > 0) {
    result.currentYearSold = data[0].totalSoldAmount;
  }
  return result;
}

export async function getAttributesNames() {
  const data = await Product.aggregate<{ _id: string }>([
    {
      $match: {},
    },
    {
      $unwind: {
        path: "$attributes",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$attributes.name",
      },
    },
  ]);
  const set = new Set(data.map((item) => item._id));
  AttributesOptions.forEach((item) => set.add(item));
  return Array.from(set);
}
