"use server";

import { redirect } from "next/navigation";
import Product from "../../../lib/models/Product";
import { revalidatePath } from "next/cache";
import Customer from "../../../lib/models/Customer";

export async function createProduct(prev: any, formData: FormData) {
  let obj = {
    attributes: [] as { name: string; value: string }[],
  } as {
    attributes: { name: string; value: string }[];
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
  };
  formData.forEach((value, key) => {
    if (key.split(".")[0] === "attributes") {
      const index = Number(key.split(".")[1]);
      // @ts-ignore
      obj.attributes[index] = {
        // @ts-ignore
        ...obj.attributes[index],
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

  const product = new Product(obj);
  await product.save();
  redirect("/products");
  // return product.toJSON();
}

export async function deleteProduct(prev: any, _id: string) {
  await Product.findByIdAndDelete(_id);
  revalidatePath("/products");
}

export async function getProduct(_id: string) {
  const prod = await Product.findById(_id);
  return prod?.toJSON();
}

export async function getProducts() {
  const items = await Product.find().lean();

  return items;
}
