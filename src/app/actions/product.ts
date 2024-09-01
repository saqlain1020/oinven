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
        $or: [
          {
            paymentType: PaymentType.Credit,
            $expr: {
              $eq: ["$sellPrice", "$paymentsAmount"],
            },
          },
          {
            paymentType: PaymentType.Cash,
            $expr: {
              $ne: ["$sellPrice", null],
            },
          },
          {
            paymentType: PaymentType.Account,
            $expr: {
              $ne: ["$sellPrice", null],
            },
          },
          {
            paymentType: PaymentType.Hybrid,
            $expr: {
              $ne: ["$sellPrice", null],
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
            paymentType: PaymentType.Cash,
            sellPrice: { $exists: true },
            soldAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: PaymentType.Account,
            sellPrice: { $exists: true },
            soldAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: PaymentType.Hybrid,
            sellPrice: { $exists: true },
            soldAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            paymentType: PaymentType.Credit,
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
            buyPaymentType: PaymentType.Cash,
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            buyPaymentType: PaymentType.Account,
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            buyPaymentType: PaymentType.Hybrid,
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: todayStart,
              $lte: todayEnd,
            },
          },
          {
            buyPaymentType: PaymentType.Credit,
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
  /** Items that are bought on full payment today */
  const todayBoughtItems = data.filter((item) => {
    if (item.buyPaymentType !== PaymentType.Credit && moment(item.boughtAt).isBetween(todayStart, todayEnd, null, "[]"))
      return true;
    return false;
  });
  /** Items that are sold on full payment today */
  const todaySoldItems = data.filter((item) => {
    if (item.paymentType !== PaymentType.Credit && moment(item.soldAt).isBetween(todayStart, todayEnd, null, "[]"))
      return true;
    return false;
  });
  /** Items that have been bought with credit and has atleast one credit transaction on current day */
  const todayBoughtCreditItems = data.filter((item) => {
    if (item.buyPaymentType === PaymentType.Credit) {
      return item.buyPayments.some((ele) => moment(ele.date).isBetween(todayStart, todayEnd, null, "[]"));
    }
    return false;
  });
  /** Items that have been sold with credit and has atleast one credit transaction on current day */
  const todaySoldCreditItems = data.filter((item) => {
    if (item.paymentType === PaymentType.Credit) {
      return item.payments.some((ele) => moment(ele.date).isBetween(todayStart, todayEnd, null, "[]"));
    }
    return false;
  });

  const todayBought = todayBoughtItems.reduce((acc, item) => acc + item.buyPrice, 0);
  const todaySold = todaySoldItems.reduce((acc, item) => acc + item.sellPrice, 0);
  const todayCreditPaid = todayBoughtCreditItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.buyPayments.forEach((ele) => {
      if (moment(ele.date).isBetween(todayStart, todayEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const todayCreditReceived = todaySoldCreditItems.reduce((acc, item) => {
    let amountToBeAdded = 0;
    item.payments.forEach((ele) => {
      if (moment(ele.date).isBetween(todayStart, todayEnd, null, "[]")) {
        amountToBeAdded += ele.amount;
      }
    });
    return acc + amountToBeAdded;
  }, 0);
  const todayExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

  const profit = todaySold - todayBought - todayCreditPaid + todayCreditReceived - todayExpense;
  return {
    todayBoughtItems,
    todaySoldItems,
    todayExpense,
    todayBoughtCreditItems,
    todaySoldCreditItems,
    todayBought,
    todaySold,
    todayCreditPaid,
    todayCreditReceived,
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
            paymentType: "Cash",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: monthStart,
              $lte: monthEnd,
            },
          },
          {
            paymentType: "Account",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: monthStart,
              $lte: monthEnd,
            },
          },
          {
            paymentType: "Credit",
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
            buyPaymentType: "Cash",
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: monthStart,
              $lte: monthEnd,
            },
          },
          {
            buyPaymentType: "Account",
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: monthStart,
              $lte: monthEnd,
            },
          },
          {
            buyPaymentType: "Credit",
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
  // const isInToday = someMoment.isBetween(todayStart, todayEnd, null, '[]');
  const monthBoughtItems = data.filter((item) => {
    if (item.buyPaymentType !== PaymentType.Credit && moment(item.boughtAt).isBetween(monthStart, monthEnd, null, "[]"))
      return true;

    // Check for credit clearance
    if (item.buyPaymentType === PaymentType.Credit) {
      const hasCreditThisTime = item.buyPayments.some((ele) =>
        moment(ele.date).isBetween(monthStart, monthEnd, null, "[]")
      );
      const totalPayments = item.buyPayments.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (totalPayments === item.buyPrice && hasCreditThisTime) return true;
    }
    return false;
  });
  const monthSoldItems = data.filter((item) => {
    if (item.paymentType !== PaymentType.Credit && moment(item.soldAt).isBetween(monthStart, monthEnd, null, "[]"))
      return true;
    // Check for credit clearance
    if (item.paymentType === PaymentType.Credit) {
      const hasCreditThisTime = item.payments.some((ele) =>
        moment(ele.date).isBetween(monthStart, monthEnd, null, "[]")
      );
      const totalPayments = item.payments.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (totalPayments === item.sellPrice && hasCreditThisTime) return true;
    }
    return false;
  });
  const monthBought = monthBoughtItems.reduce((acc, item) => {
    return acc + item.buyPrice;
  }, 0);
  const monthSold = monthSoldItems.reduce((acc, item) => {
    return acc + item.sellPrice;
  }, 0);
  const monthExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
  return {
    monthBought,
    monthSold,
    monthExpense,
    monthProfit: monthSold - monthBought - monthExpense,
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
            paymentType: "Cash",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: weekStart,
              $lte: weekEnd,
            },
          },
          {
            paymentType: "Account",
            sellPrice: { $exists: true },
            soldAt: {
              $gte: weekStart,
              $lte: weekEnd,
            },
          },
          {
            paymentType: "Credit",
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
            buyPaymentType: "Cash",
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: weekStart,
              $lte: weekEnd,
            },
          },
          {
            buyPaymentType: "Account",
            buyPrice: { $exists: true },
            boughtAt: {
              $gte: weekStart,
              $lte: weekEnd,
            },
          },
          {
            buyPaymentType: "Credit",
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
  // const isInToday = someMoment.isBetween(todayStart, todayEnd, null, '[]');
  const weekBoughtItems = data.filter((item) => {
    if (item.buyPaymentType !== PaymentType.Credit && moment(item.boughtAt).isBetween(weekStart, weekEnd, null, "[]"))
      return true;

    // Check for credit clearance
    if (item.buyPaymentType === PaymentType.Credit) {
      const hasCreditThisTime = item.buyPayments.some((ele) =>
        moment(ele.date).isBetween(weekStart, weekEnd, null, "[]")
      );
      const totalPayments = item.buyPayments.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (totalPayments === item.buyPrice && hasCreditThisTime) return true;
    }
    return false;
  });
  const weekSoldItems = data.filter((item) => {
    if (item.paymentType !== PaymentType.Credit && moment(item.soldAt).isBetween(weekStart, weekEnd, null, "[]"))
      return true;
    // Check for credit clearance
    if (item.paymentType === PaymentType.Credit) {
      const hasCreditThisTime = item.payments.some((ele) => moment(ele.date).isBetween(weekStart, weekEnd, null, "[]"));
      const totalPayments = item.payments.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
      if (totalPayments === item.sellPrice && hasCreditThisTime) return true;
    }
    return false;
  });
  const weekBought = weekBoughtItems.reduce((acc, item) => {
    return acc + item.buyPrice;
  }, 0);
  const weekSold = weekSoldItems.reduce((acc, item) => {
    return acc + item.sellPrice;
  }, 0);
  const weekExpense = expenses.reduce((acc, item) => acc + item.amount, 0);
  return {
    weekBought,
    weekSold,
    weekExpense,
    weekProfit: weekSold - weekBought - weekExpense,
  };
}

export async function getCreditsToReceive() {
  const data = await Product.aggregate<IProductPopulated>([
    {
      $match: {
        paymentType: PaymentType.Credit,
      },
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
      $match: {
        buyPaymentType: PaymentType.Credit,
      },
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
