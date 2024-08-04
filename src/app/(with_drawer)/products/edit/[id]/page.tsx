import React from "react";
import EditPageComp from "./_components/EditPageComp";
import { getAttributesNames, getProduct } from "src/app/actions/product";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const prod = await getProduct(params.id);
  const attributeNames = await getAttributesNames();
  if (!prod) throw new Error("Product not found!");
  return <EditPageComp product={prod} attributeNames={attributeNames} />;
}
