import React from "react";
import AddProductComponent from "./_components/AddProductComponent";
import { getAttributesNames } from "src/app/actions/product";

export default async function AddProduct() {
  const attributeNames = await getAttributesNames();

  return <AddProductComponent attributeNames={attributeNames} />;
}
