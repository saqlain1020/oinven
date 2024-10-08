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
import { AttributesOptions, PaymentType, ProductCategory } from "src/types/product";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { Delete, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useFormState, useFormStatus } from "react-dom";
import { createOrUpdateProduct } from "src/app/actions/product";
import { IMaskInput } from "react-imask";
import moment, { Moment } from "moment";
import { IProductPopulated } from "../../../../../../lib/models/Product";

const AddProductComponent: React.FC<{ attributeNames: string[]; oldProduct?: IProductPopulated | null }> = ({
  attributeNames,
  oldProduct,
}) => {
  const [category, setCategory] = useState(oldProduct?.category || ProductCategory.Phone);
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(
    oldProduct?.attributes || [
      { name: AttributesOptions[0], value: "" },
      { name: AttributesOptions[1], value: "" },
      { name: AttributesOptions[2], value: "" },
      { name: AttributesOptions[3], value: "" },
      { name: AttributesOptions[4], value: "" },
      { name: AttributesOptions[5], value: "" },
      { name: AttributesOptions[6], value: "" },
      { name: AttributesOptions[7], value: "" },
      { name: AttributesOptions[8], value: "" },
      { name: AttributesOptions[9], value: "" },
    ]
  );
  const [payments, setPayments] = useState<
    { date: moment.Moment; amount: number; type: PaymentType; account?: string }[]
  >([]);
  const [buyPayments, setBuyPayments] = useState<
    { date: moment.Moment; amount: number; type: PaymentType; account?: string }[]
  >([]);
  const [state, formAction] = useFormState(createOrUpdateProduct, null);
  const [boughtAt, setBoughtAt] = useState<Moment | null>(null);
  const [soldAt, setSoldAt] = useState<Moment | null>(null);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };
  const handleAddPayment = () => {
    setPayments([...payments, { date: moment(), amount: 0, type: PaymentType.Cash }]);
  };
  const handleAddBuyPayment = () => {
    setBuyPayments([...buyPayments, { date: moment(), amount: 0, type: PaymentType.Cash }]);
  };

  const handleAttributeChange = (index: number, name: string, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { name, value };
    setAttributes(newAttributes);
  };

  const handlePaymentChange = (
    index: number,
    date: moment.Moment,
    amount: number,
    type: PaymentType,
    account?: string
  ) => {
    const newPayments = [...payments];
    newPayments[index] = { date, account, type, amount };
    setPayments(newPayments);
  };
  const handleBuyPaymentChange = (
    index: number,
    date: moment.Moment,
    amount: number,
    type: PaymentType,
    account?: string
  ) => {
    const newPayments = [...buyPayments];
    newPayments[index] = { date, amount, type, account };
    setBuyPayments(newPayments);
  };

  const deleteAttribute = (index: number) => {
    setAttributes(attributes.filter((item, i) => i !== index));
  };

  const deletePayment = (index: number) => {
    setPayments(payments.filter((item, i) => i !== index));
  };
  const deleteBuyPayment = (index: number) => {
    setBuyPayments(buyPayments.filter((item, i) => i !== index));
  };

  return (
    <Box
      component={"form"}
      //  onSubmit={handleSubmit}
      action={formAction}
    >
      <Typography variant="h5" fontWeight={600}>
        Product Details
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField name="name" fullWidth label="Name" required defaultValue={oldProduct?.name} />
        </Grid>

        {/* Category */}
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
            name="description"
            fullWidth
            rows={3}
            label="Description"
            defaultValue={oldProduct?.description}
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
                  options={attributeNames}
                  value={item.name}
                  fullWidth
                  renderInput={(params) => <TextField required {...params} name={`attributes.${i}.name`} />}
                  onChange={(_, v) => handleAttributeChange(i, v || "", item.value)}
                />
                <TextField
                  name={`attributes.${i}.value`}
                  value={item.value}
                  fullWidth
                  required
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
        {
          // #region Buy
        }
        {/* Buy Section */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Buy Section
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="buyingName" fullWidth label="Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="buyingPhone" fullWidth label="Phone" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="formatted-text-mask-input" sx={{ background: "black" }}>
              NIC
            </InputLabel>
            <OutlinedInput
              fullWidth
              name="buyingNic"
              // value={values.textmask}
              // onChange={handleChange}
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom as any}
            />
          </FormControl>
        </Grid>
        {/* Bought At */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            name="boughtAt"
            value={boughtAt}
            onChange={(e) => setBoughtAt(e)}
            label="Buying Date"
            sx={{ width: "100%" }}
          />
        </Grid>
        {/* Buy Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="buyPrice"
            onChange={(e) => {
              if (Number(e.target.value) > 0) {
                if (boughtAt === null) setBoughtAt(moment());
              } else {
                setBoughtAt(null);
              }
            }}
            fullWidth
            label="Buying Price"
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            type="number"
          />
        </Grid>
        {/* Payments */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Payments (Total: {buyPayments.reduce((prev, acc) => prev + acc.amount, 0)})
          </Typography>
        </Grid>
        {buyPayments.map((item, i) => (
          <Grid key={i} item xs={12}>
            <Box
              sx={{
                display: "grid",
                gap: 3,

                gridTemplateColumns: {
                  md: item.type === PaymentType.Account ? "1fr 1fr 1fr 1fr max-content" : "1fr 1fr 1fr max-content",
                  sm: "1fr",
                },
                alignItems: "center",
              }}
            >
              <DatePicker
                name={`buyPayments.${i}.date`}
                label="Payment Date"
                sx={{ width: "100%" }}
                value={item.date}
                onChange={(v) => handleBuyPaymentChange(i, v || moment(), item.amount, item.type, item.account)}
              />
              <TextField
                name={`buyPayments.${i}.amount`}
                fullWidth
                value={item.amount}
                label="Payment Amount"
                required
                type="number"
                // @ts-ignore
                onWheel={(e) => e.target.blur()}
                onChange={(e) => handleBuyPaymentChange(i, item.date, Number(e.target.value), item.type, item.account)}
              />
              <TextField
                name={`buyPayments.${i}.type`}
                value={item.type}
                select
                fullWidth
                label="Medium"
                onChange={(e) =>
                  handleBuyPaymentChange(i, item.date, item.amount, e.target.value as PaymentType, item.account)
                }
              >
                <MenuItem value={PaymentType.Cash}>{PaymentType.Cash}</MenuItem>
                <MenuItem value={PaymentType.Account}>{PaymentType.Account}</MenuItem>
              </TextField>
              {item.type === PaymentType.Account && (
                <TextField
                  name={`buyPayments.${i}.account`}
                  fullWidth
                  value={item.account}
                  label="Account"
                  type="number"
                  required
                  onChange={(e) => handleBuyPaymentChange(i, item.date, item.amount, item.type, e.target.value)}
                />
              )}
              <IconButton onClick={() => deleteBuyPayment(i)}>
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box className="center">
            <Button variant="outlined" onClick={() => handleAddBuyPayment()}>
              Add Payment
            </Button>
          </Box>
        </Grid>
        {
          // #endregion Buy
        }
        {
          // #region Sell
        }
        {/* Sell Section */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Sell Section
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="sellingName" fullWidth label="Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="sellingPhone" fullWidth label="Phone" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="formatted-text-mask-input" sx={{ background: "black" }}>
              NIC
            </InputLabel>
            <OutlinedInput
              fullWidth
              // value={values.textmask}
              // onChange={handleChange}
              name="sellingNic"
              id="formatted-text-mask-input"
              inputComponent={TextMaskCustom as any}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            name="soldAt"
            value={soldAt}
            onChange={(e) => setSoldAt(e)}
            label="Sell Date"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="sellPrice"
            onChange={(e) => {
              if (Number(e.target.value) > 0) {
                if (soldAt === null) setSoldAt(moment());
              } else {
                setSoldAt(null);
              }
            }}
            // @ts-ignore
            onWheel={(e) => e.target.blur()}
            fullWidth
            label="Sell Price"
            type="number"
          />
        </Grid>

        {/* Payments */}
        <Grid item xs={12}>
          <Typography fontWeight={600} variant="h6">
            Payments (Total: {payments.reduce((prev, acc) => prev + acc.amount, 0)})
          </Typography>
        </Grid>
        {payments.map((item, i) => (
          <Grid key={i} item xs={12}>
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  md: item.type === PaymentType.Account ? "1fr 1fr 1fr 1fr max-content" : "1fr 1fr 1fr max-content",
                  sm: "1fr",
                },
                alignItems: "center",
              }}
            >
              <DatePicker
                name={`payments.${i}.date`}
                label="Payment Date"
                value={item.date}
                sx={{ width: "100%" }}
                onChange={(v) => handlePaymentChange(i, v || moment(), item.amount, item.type, item.account)}
              />
              <TextField
                name={`payments.${i}.amount`}
                fullWidth
                value={item.amount}
                label="Payment Amount"
                type="number"
                // @ts-ignore
                onWheel={(e) => e.target.blur()}
                required
                onChange={(e) => handlePaymentChange(i, item.date, Number(e.target.value), item.type, item.account)}
              />
              <TextField
                name={`payments.${i}.type`}
                value={item.type}
                select
                fullWidth
                label="Medium"
                onChange={(e) =>
                  handlePaymentChange(i, item.date, item.amount, e.target.value as PaymentType, item.account)
                }
              >
                <MenuItem value={PaymentType.Cash}>{PaymentType.Cash}</MenuItem>
                <MenuItem value={PaymentType.Account}>{PaymentType.Account}</MenuItem>
              </TextField>
              {item.type === PaymentType.Account && (
                <TextField
                  name={`payments.${i}.account`}
                  fullWidth
                  value={item.account}
                  label="Account"
                  type="number"
                  required
                  onChange={(e) => handlePaymentChange(i, item.date, item.amount, item.type, e.target.value)}
                />
              )}
              <IconButton onClick={() => deletePayment(i)}>
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Box className="center">
            <Button variant="outlined" onClick={() => handleAddPayment()}>
              Add Payment
            </Button>
          </Box>
        </Grid>

        {
          // #endregion Sell
        }
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddProductComponent;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LoadingButton loading={pending} type="submit" loadingPosition="start" startIcon={<Save />} variant="contained">
      Save Product
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
