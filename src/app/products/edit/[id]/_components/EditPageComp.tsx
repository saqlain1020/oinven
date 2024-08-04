"use client";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  OutlinedInput,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { AttributesOptions, ProductCategory } from "src/types/product";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useState } from "react";
import { Delete, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useFormState, useFormStatus } from "react-dom";
import { createOrUpdateProduct } from "src/app/actions/product";

import { IMaskInput } from "react-imask";
import { IProductPopulated } from "../../../../../../lib/models/Product";

const EditPageComp: React.FC<{ product: IProductPopulated }> = ({ product }) => {
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(product.attributes);
  const [state, formAction] = useFormState(createOrUpdateProduct, null);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const handleAttributeChange = (index: number, name: string, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { name, value };
    setAttributes(newAttributes);
  };

  const deleteAttribute = (index: number) => {
    setAttributes(attributes.filter((item, i) => i !== index));
  };

  return (
    <Box
      component={"form"}
      //  onSubmit={handleSubmit}
      action={(data) => {
        data.append("productId", product._id);
        formAction(data);
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Product Details
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField name="name" defaultValue={product.name} fullWidth label="Name" required />
        </Grid>

        {/* Category */}
        <Grid item xs={12} sm={6}>
          <TextField name="category" fullWidth select label="Category" defaultValue={product.category}>
            {Object.entries(ProductCategory).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            multiline
            defaultValue={product.description}
            name="description"
            fullWidth
            rows={3}
            label="Description"
          />
        </Grid>
        {/* Attributes */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Attributes (name,value)
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          {attributes.map((item, i) => (
            <Grid key={i} item xs={12}>
              <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: "1fr 1fr max-content", alignItems: "center" }}>
                <Autocomplete
                  freeSolo
                  options={AttributesOptions}
                  value={item.name}
                  fullWidth
                  renderInput={(params) => <TextField {...params} name={`attributes.${i}.name`} />}
                  onChange={(_, v) => handleAttributeChange(i, v || "", item.value)}
                />
                <TextField
                  name={`attributes.${i}.value`}
                  value={item.value}
                  fullWidth
                  onChange={(e) => handleAttributeChange(i, item.name, e.target.value)}
                />

                <IconButton onClick={() => deleteAttribute(i)}>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box className="center">
              <Button variant="outlined" onClick={() => handleAddAttribute()}>
                Add More
              </Button>
            </Box>
          </Grid>
        </Grid>
        {/* Buy Section */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Buy Section
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField name="buyingPhone" defaultValue={product.boughtFrom?.phone} fullWidth label="Phone" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="formatted-text-mask-input" sx={{ background: "white" }}>
              NIC
            </InputLabel>
            <OutlinedInput
              fullWidth
              defaultValue={product.boughtFrom?.nic}
              name="buyingNic"
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom as any}
            />
          </FormControl>
        </Grid>
        {/* Bought At */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            defaultValue={product.boughtAt ? moment(product.boughtAt) : undefined}
            name="boughtAt"
            label="Buying Date"
            sx={{ width: "100%" }}
          />
        </Grid>
        {/* Buy Price */}
        <Grid item xs={12} sm={6}>
          <TextField name="buyPrice" defaultValue={product.buyPrice} fullWidth label="Buying Price" type="number" />
        </Grid>
        {/* Sell Section */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Sell Section
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="sellingPhone" defaultValue={product.soldTo?.phone} fullWidth label="Phone" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="formatted-text-mask-input" sx={{ background: "white" }}>
              NIC
            </InputLabel>
            <OutlinedInput
              fullWidth
              defaultValue={product.soldTo?.nic}
              name="sellingNic"
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom as any}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            name="soldAt"
            defaultValue={product.soldAt ? moment(product.soldAt) : undefined}
            label="Sell Date"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="sellPrice" defaultValue={product.sellPrice} fullWidth label="Sell Price" type="number" />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditPageComp;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LoadingButton loading={pending} type="submit" loadingPosition="start" startIcon={<Save />} variant="contained">
      Save Changes
    </LoadingButton>
  );
}
const TextMaskCustom = React.forwardRef<
  HTMLInputElement,
  {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
>(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00000-0000000-0"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});