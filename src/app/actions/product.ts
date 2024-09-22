"use server";

import { redirect } from "next/navigation";
import Product, { IProduct, IProductPopulated } from "../../../lib/models/Product";
import { revalidatePath } from "next/cache";
import Customer from "../../../lib/models/Customer";
import { AttributesOptions, PaymentType } from "src/types/product";
import moment from "moment-timezone";
import { sleep } from "src/utils/common";
import Expense from "../../../lib/models/Expense";
const timezone = "Asia/Karachi";

export async function createOrUpdateProduct(prev: any, formData: FormData) {
  let obj = {
    attributes: [] as { name: string; value: string }[],
    payments: [] as { date: Date; amount: number }[],
  } as {
    attributes: { name: string; value: string }[];
    payments: { date: Date; amount: number }[];
    name: string;
    category: string;
    description?: string;
    buyingPhone?: string;
    buyingNic?: string;
    buyingName?: string;
    sellingName?: string;
    boughtAt?: string;
    buyPrice?: string;
    sellingPhone?: string;
    sellingNic?: string;
    solAt?: string;
    sellPrice?: string;
    // not in form data
    boughtFrom?: string;
    soldTo?: string;
    // Only if editing
    productId?: string;
  };
  formData.forEach((value, key) => {
    if (key.split(".")[0] === "attributes" || key.split(".")[0] === "payments") {
      const keyName = key.split(".")[0];
      const index = Number(key.split(".")[1]);
      // @ts-ignore
      obj[keyName][index] = {
        // @ts-ignore
        ...obj[keyName][index],
        [key.split(".")[2]]: value,
      };
    } else {
      // @ts-ignore
      obj[key] = value;
    }
  });
  if (obj.buyingNic) {
    let boughtFrom = await Customer.findOne({ nic: obj.buyingNic });
    if (!boughtFrom) {
      boughtFrom = await Customer.create({
        name: obj.buyingName,
        nic: obj.buyingNic,
        phone: obj.buyingPhone,
      });
    }
    obj.boughtFrom = boughtFrom!._id;
  }
  if (obj.sellingNic) {
    let soldTo = await Customer.findOne({ nic: obj.sellingNic });
    if (!soldTo) {
      soldTo = await Customer.create({
        name: obj.sellingName,
        nic: obj.sellingNic,
        phone: obj.sellingPhone,
      });
    }
    obj.soldTo = soldTo!._id;
  }
  console.log("obj =>", obj);
  if (obj.productId) {
    const product = await Product.findOneAndUpdate({ _id: obj.productId }, obj, { new: true });
    revalidatePath("/products/edit/" + obj.productId);
    return product!.toJSON();
  } else {
    const product = new Product(obj);
    await product.save();
    redirect("/products");
  }
}

export async function deleteProduct(prev: any, _id: string) {
  await Product.findByIdAndDelete(_id);
  revalidatePath("/products");
}

export async function getProduct(_id: string) {
  const prod = await Product.findById(_id);
  return prod?.toJSON() as IProductPopulated;
}

export async function getSales() {
  const res = await Product.aggregate<IProductPopulated>([
    {
      $addFields: {
        paymentsAmount: {
          $sum: "$payments.amount",
        },
      },
    },
    {
      $match: {
        $and: [
          {
            $expr: {
              $ne: ["$sellPrice", null],
            },
          },
          {
            $expr: {
              $eq: ["$sellPrice", "$paymentsAmount"],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "soldTo",
        foreignField: "_id",
        as: "soldTo",
      },
    },
    {
      $unwind: {
        path: "$soldTo",
        preserveNullAndEmptyArrays: false,
      },
    },
  ]);

  return res;
}

/** Get products in shop, which are not sold */
export async function getInventory() {
  const items = await Product.find({ sellPrice: { $eq: null } })
    .sort("-updatedAt")
    .lean();

  return JSON.parse(JSON.stringify(items)) as IProductPopulated[];
}

export async function getAttributesNames() {
  const data = await Product.aggregate<{ _id: string }>([
    {
      $match: {},
    },
    {
      $unwind: {
        path: "$attributes",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$attributes.name",
      },
    },
  ]);
  const set = new Set(data.map((item) => item._id));
  AttributesOptions.forEach((item) => set.add(item));
  return Array.from(set);
}

export async function getTodaysData() {
  const todayStart = moment.tz(timezone).startOf("day").toDate();
  const todayEnd = moment.tz(timezone).endOf("day").toDate();

  const data = await Product.aggregate<IProduct>([
    {
      $match: {
        $or: [
          {
            payments: {
              $elemMatch: {
                date: {
                  $gte: todayStart,
                  $lte: todayEnd,
                },
              },
            },
          },
          {
            buyPayments: {
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

  const expenses = await Expense.find({ date: { $gte: todayStart, $lte: todayEnd } }).lean();

  const todayBoughtItems = data.filter((item) => {
    return item.buyPayments.some((ele) => moment(ele.date).isBetween(todayStart, todayEnd, null, "[]"));
  });
  const todaySoldItems = data.filter((item) => {
    return item.payments.some((ele) => moment(ele.date).isBetween(todayStart, todayEnd, null, "[]"));
  });

  const todayAmountPaid = todayBoughtItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.buyPayments.forEach((ele) => {
      if (moment(ele.date).isBetween(todayStart, todayEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const todayAmountReceived = todaySoldItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.payments.forEach((ele) => {
      if (moment(ele.date).isBetween(todayStart, todayEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const todayExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

  const todayProfitAdd = todaySoldItems.reduce((acc, item) => {
    let totalPayments = 0;
    let todayPayment = 0;
    let totalPaymentBeforeToday = 0;
    item.payments.forEach((ele) => {
      totalPayments += ele.amount;
      if (moment(ele.date).isBetween(todayStart, todayEnd, null, "[]")) {
        todayPayment += ele.amount;
      } else {
        totalPaymentBeforeToday += ele.amount;
      }
    });
    let profit = 0;
    if (totalPaymentBeforeToday > item.buyPrice) {
      profit = todayPayment;
    } else {
      profit = totalPayments - item.buyPrice;
    }
    return acc + profit;
  }, 0);

  const profit = todayProfitAdd - todayExpense;
  return {
    todayBought: todayAmountPaid,
    todaySold: todayAmountReceived,
    todayExpense,
    profit,
  };
}
export async function getCurrentMonthsData() {
  const monthStart = moment.tz(timezone).startOf("month").toDate();
  const monthEnd = moment.tz(timezone).endOf("month").toDate();

  const data = await Product.aggregate<IProduct>([
    {
      $match: {
        $or: [
          {
            payments: {
              $elemMatch: {
                date: {
                  $gte: monthStart,
                  $lte: monthEnd,
                },
              },
            },
          },
          {
            buyPayments: {
              $elemMatch: {
                date: {
                  $gte: monthStart,
                  $lte: monthEnd,
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const expenses = await Expense.find({
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  }).lean();

  const monthBoughtItems = data.filter((item) => {
    return item.buyPayments.some((ele) => moment(ele.date).isBetween(monthStart, monthEnd, null, "[]"));
  });
  const monthSoldItems = data.filter((item) => {
    return item.payments.some((ele) => moment(ele.date).isBetween(monthStart, monthEnd, null, "[]"));
  });

  const monthAmountPaid = monthBoughtItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.buyPayments.forEach((ele) => {
      if (moment(ele.date).isBetween(monthStart, monthEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const monthAmountReceived = monthSoldItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.payments.forEach((ele) => {
      if (moment(ele.date).isBetween(monthStart, monthEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const monthExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
  const monthProfitAdd = monthSoldItems.reduce((acc, item) => {
    let totalPayments = 0;
    let todayPayment = 0;
    let totalPaymentBeforeToday = 0;
    item.payments.forEach((ele) => {
      totalPayments += ele.amount;
      if (moment(ele.date).isBetween(monthStart, monthEnd, null, "[]")) {
        todayPayment += ele.amount;
      } else {
        totalPaymentBeforeToday += ele.amount;
      }
    });
    let profit = 0;
    if (totalPaymentBeforeToday > item.buyPrice) {
      profit = todayPayment;
    } else {
      profit = totalPayments - item.buyPrice;
    }
    return acc + profit;
  }, 0);

  const profit = monthProfitAdd - monthExpense;

  return {
    monthBought: monthAmountPaid,
    monthSold: monthAmountReceived,
    monthExpense,
    monthProfit: profit,
  };
}
export async function getCurrentWeekData() {
  const weekStart = moment.tz(timezone).startOf("week").toDate();
  const weekEnd = moment.tz(timezone).endOf("week").toDate();

  const data = await Product.aggregate<IProduct>([
    {
      $match: {
        $or: [
          {
            payments: {
              $elemMatch: {
                date: {
                  $gte: weekStart,
                  $lte: weekEnd,
                },
              },
            },
          },
          {
            buyPayments: {
              $elemMatch: {
                date: {
                  $gte: weekStart,
                  $lte: weekEnd,
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const expenses = await Expense.find({
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  }).lean();

  const weekBoughtItems = data.filter((item) => {
    return item.buyPayments.some((ele) => moment(ele.date).isBetween(weekStart, weekEnd, null, "[]"));
  });
  const weekSoldItems = data.filter((item) => {
    return item.payments.some((ele) => moment(ele.date).isBetween(weekStart, weekEnd, null, "[]"));
  });

  const weekAmountPaid = weekBoughtItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.buyPayments.forEach((ele) => {
      if (moment(ele.date).isBetween(weekStart, weekEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const weekAmountReceived = weekSoldItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.payments.forEach((ele) => {
      if (moment(ele.date).isBetween(weekStart, weekEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const weekExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

  const weekProfitAdd = weekSoldItems.reduce((acc, item) => {
    let totalPayments = 0;
    let todayPayment = 0;
    let totalPaymentBeforeToday = 0;
    item.payments.forEach((ele) => {
      totalPayments += ele.amount;
      if (moment(ele.date).isBetween(weekStart, weekEnd, null, "[]")) {
        todayPayment += ele.amount;
      } else {
        totalPaymentBeforeToday += ele.amount;
      }
    });
    let profit = 0;
    if (totalPaymentBeforeToday > item.buyPrice) {
      profit = todayPayment;
    } else {
      profit = totalPayments - item.buyPrice;
    }
    return acc + profit;
  }, 0);

  const profit = weekProfitAdd - weekExpense;
  return {
    weekBought: weekAmountPaid,
    weekSold: weekAmountReceived,
    weekExpense,
    weekProfit: profit,
  };
}

export async function getCreditsToReceive() {
  const data = await Product.aggregate<IProductPopulated>([
    {
      $match: {},
    },
    {
      $addFields: {
        paymentsAmount: {
          $sum: "$payments.amount",
        },
      },
    },
    {
      $match: {
        $expr: {
          $ne: ["$sellPrice", "$paymentsAmount"],
        },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "soldTo",
        foreignField: "_id",
        as: "soldTo",
      },
    },
    {
      $unwind: {
        path: "$soldTo",
        preserveNullAndEmptyArrays: false,
      },
    },
  ]);
  return JSON.parse(JSON.stringify(data));
}

export async function getCreditsToPay() {
  const data = await Product.aggregate<IProductPopulated>([
    {
      $match: {},
    },
    {
      $addFields: {
        buyPaymentsAmount: {
          $sum: "$buyPayments.amount",
        },
      },
    },
    {
      $match: {
        $expr: {
          $ne: ["$buyPrice", "$buyPaymentsAmount"],
        },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "boughtFrom",
        foreignField: "_id",
        as: "boughtFrom",
      },
    },
    {
      $unwind: {
        path: "$boughtFrom",
        preserveNullAndEmptyArrays: false,
      },
    },
  ]);
  return JSON.parse(JSON.stringify(data));
}
