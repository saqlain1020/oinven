"use server";

import { redirect } from "next/navigation";
import Product from "../../../lib/models/Product";
import { revalidatePath } from "next/cache";

export async function createProduct(prev: any, formData: FormData) {
  let obj = {
    attributes: [],
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
