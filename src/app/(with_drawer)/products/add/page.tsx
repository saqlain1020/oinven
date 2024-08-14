import React from "react";
import AddProductComponent from "./_components/AddProductComponent";
import { getAttributesNames, getProduct } from "src/app/actions/product";
import { IProductPopulated } from "../../../../../lib/models/Product";

export default async function AddProduct({ searchParams: { rebuyid } }: { searchParams: { rebuyid?: string } }) {
  const attributeNames = await getAttributesNames();
  let oldProduct: IProductPopulated | null = null;
  if (rebuyid) {
    oldProduct = await getProduct(rebuyid);
  }

  return <AddProductComponent attributeNames={attributeNames} oldProduct={oldProduct} />;
}
