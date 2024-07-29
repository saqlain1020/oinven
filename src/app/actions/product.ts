"use server";

import { sleep } from "src/utils/common";
import Product from "../../../lib/models/Product";

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
  return product.toJSON();
  // ...
}

export async function getProducts() {
  const items = await Product.find().lean();

  console.log("items =>", items);
  return items;
}
