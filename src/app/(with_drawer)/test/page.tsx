import { Box } from "@mui/material";
import moment from "moment-timezone";
import Product from "../../../../lib/models/Product";

export default async function () {
  const timezone = "Asia/Karachi";

  // Calculate the start and end of the day
  const todayStart = moment.tz(timezone).startOf("day").toDate();
  const todayEnd = moment.tz(timezone).endOf("day").toDate();

  const data = await Product.aggregate([
    {
      $match: {
        $or: [
          {
            boughtAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: "Cash",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: "Account",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: "Credit",
            payments: {
              $elemMatch: {
                date: {
                  $gte: todayStart,
                  $lte: todayEnd,
                },
              },
            },
          },
        ],
      },
    },
  ]);
  console.log("data =>", data);

  return <Box></Box>;
}
