"use client";
import { Autocomplete, Box, Button, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { ProductCategory } from "src/types/product";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { FormEventHandler, useEffect, useState } from "react";
import { Add, Delete, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useFormState, useFormStatus } from "react-dom";
import { createProduct } from "src/app/actions/product";

export default function AddProduct() {
  const [category, setCategory] = useState(ProductCategory.Phone);
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [boughtAt, setBoughtAt] = useState(moment());
  const [state, formAction] = useFormState(createProduct, null);

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
      action={formAction}
    >
      <Typography variant="h5" fontWeight={600}>
        Form for adding new product
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            fullWidth
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="category"
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
          >
            {Object.entries(ProductCategory).map(([key, value]) => (
              <MenuItem value={value}>{key}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="buyPrice"
            fullWidth
            label="Buying Price"
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            name="boughtAt"
            label="Buying Date"
            sx={{ width: "100%" }}
            value={boughtAt}
            onChange={(v) => {
              setBoughtAt(v || moment());
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            name="description"
            fullWidth
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
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
                  options={["Imei", "Manufacturer", "Color", "Storage", "Ram", "Battery Health", "Condition"]}
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
              <IconButton onClick={() => handleAddAttribute()}>
                <Add />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LoadingButton loading={pending} type="submit" loadingPosition="start" startIcon={<Save />} variant="contained">
      Save Product
    </LoadingButton>
  );
}
