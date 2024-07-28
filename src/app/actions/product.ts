"use server";

import Product from "../../../lib/models/Product";

export async function create() {
  // ...
}

export async function getProducts() {
  const items = await Product.find().lean();

  console.log("items =>", items);
  return items;
}
