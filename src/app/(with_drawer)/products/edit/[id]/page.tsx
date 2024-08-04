import React from "react";
import EditPageComp from "./_components/EditPageComp";
import { getProduct } from "src/app/actions/product";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const prod = await getProduct(params.id);
  if (!prod) throw new Error("Product not found!");
  return <EditPageComp product={prod} />;
}
