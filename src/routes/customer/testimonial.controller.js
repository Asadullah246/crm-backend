import {
  createJob,
  createJobMany,
  getJobApi,
  getJobsApi,
  patchJob,
  removeJob,
} from "./testimonial.service.js";

import { Job as Transaction } from "../transaction/transaction.model.js";
import { Job as Payment } from "../payment/testimonial.model.js";
import { Job as Customer } from "../customer/testimonial.model.js";
import moment from "moment";

// const bcrypt = require("bcrypt");
// const JWT = require("jsonwebtoken");

// create a single user
export const createUserApi = async (req, res, next) => {
  try {
    const data = req.body;

    // if (req.file) {
    //   // Save the file path to the database
    //   const imagePath = `/uploads/${req.file.filename}`;
    //   data.logoImage = imagePath;
    // }

    const user = await createJob(data);


    if(!user){
      return res.status(401).json({ massage: "user already exists" });
    }

    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};

export const createUserApiMany = async (req, res, next) => {
  try {
    const data = req.body;

    // if (req.file) {
    //   // Save the file path to the database
    //   const imagePath = `/uploads/${req.file.filename}`;
    //   data.logoImage = imagePath;
    // }

    const user = await createJobMany(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};

// patch a single user
export const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const data = req.body;

    // if (req.file) {
    //   // Save the file path to the database
    //   const imagePath = `/uploads/${req.file.filename}`;
    //   data.logoImage = imagePath;
    // }
console.log("data", data);
    const user = await patchJob({ _id, data });
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ massage: error });
  }
};

// delete a single user
export const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const user = await removeJob(_id);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};

// get single users
export const getUser = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const users = await getJobApi(_id);
    return res.status(201).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};

// get all users
// export const getUsers = async (req, res, next) => {
//   try {
//     const users = await getJobsApi();
//     return res.status(201).json({ status: "success", data: users });
//   } catch (error) {
//     console.log(error);
//     return res.status(201).json({ massage: error });
//   }
// };

export const getUsers = async (req, res) => {
  try {
    const {search } = req.query; // Extract query parameters

    let filter = {}; // Default empty filter


    if (search) { 
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }


    const users = await getJobsApi(filter); // Pass the filter to Mongoose query
    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: error.message });
  }
};















export const getUserWithPayment = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const user = await getJobApi(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    }

    const transactions = await Transaction.find({
      customerId: _id,
      status: "active",
    });
    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ status: "success", data: { user, dues: [] } });
    }

    const payments = await Payment.find({ customerId: _id });

    const today = moment();
    const currentMonth = today.format("YYYY-MM");
    const nextMonth = today.clone().add(1, "months").format("YYYY-MM");

    let allDues = [];

    for (const transaction of transactions) {
      let dueDetails = [];
      let totalDueAmount = 0;
      let dueMonths = [];
      console.log("transaction", transaction);
      const transactionStart = moment(transaction.startDate);
      console.log("start", transactionStart);
      const transactionEnd = transaction.endDate
        ? moment(transaction.endDate)
        : null;
      console.log("end", transactionEnd);
      const transactionStartMonth = transactionStart.format("YYYY-MM");
      console.log("transactionStartMonth", transactionStartMonth);

      // for one time payment
      if (transaction.type === "oneTimePayment") {
        const paymentRecord = payments.find(
          (p) => p.transactionId.toString() === transaction._id.toString()
        );
        if (!paymentRecord || paymentRecord.status !== "completed") {
          dueDetails.push({
            month: transactionStartMonth,
            dueAmount: transaction.oneTimePaymentAmount || 0,
            status: paymentRecord ? paymentRecord.status : "pending",
          });
          totalDueAmount += transaction.oneTimePaymentAmount || 0;
        }
      }
      // for subscription and emi option
      else {
        let loopDate = transactionStart.clone().startOf("month");
        console.log("loopDate", loopDate);
        while (loopDate.isSameOrBefore(today, "month")) {
          const monthString = loopDate.format("YYYY-MM");

          if (transactionEnd && loopDate.isAfter(transactionEnd, "month"))
            break;

          const paymentRecord = payments.find(
            (p) =>
              p.transactionId.toString() === transaction._id.toString() &&
              moment(p.monthForPayment).format("YYYY-MM") === monthString
          );

          if (!paymentRecord || paymentRecord.status !== "completed") {
            let dueAmount =
              transaction.type === "subscription"
                ? transaction.subscriptionDetails?.pricePerMonth || 0
                : transaction.type === "emi"
                ? transaction.emiDetails?.pricePerMonth || 0
                : 0;

            if (monthString === transactionStartMonth && transaction.type !== "emi") {
              const daysInMonth = loopDate.daysInMonth();
              const startDay = transactionStart.date();
              const usedDays = daysInMonth - startDay + 1;
              dueAmount = (dueAmount / daysInMonth) * usedDays;
            }

            if (dueAmount > 0) {
              dueDetails.push({
                month: monthString,
                dueAmount,
                status: paymentRecord ? paymentRecord.status : "pending",
              });
              dueMonths.push(monthString);
              totalDueAmount += dueAmount;
            }
          }
          loopDate.add(1, "month");
        }
      }


      if ( transactionStart.isSameOrBefore(today, "month") &&  !dueMonths.includes(currentMonth)) {
        const currentPayment = payments.find(
          (p) =>
            p.transactionId.toString() === transaction._id.toString() &&
            moment(p.monthForPayment).format("YYYY-MM") === currentMonth
        );

        if (!currentPayment || currentPayment.status !== "completed") {
          let currentDueAmount =
            transaction.type === "subscription"
              ? transaction.subscriptionDetails?.pricePerMonth || 0
              : transaction.type === "emi"
              ? transaction.emiDetails?.pricePerMonth || 0
              : 0;

          if (currentDueAmount > 0) {
            dueDetails.push({
              month: currentMonth,
              dueAmount: currentDueAmount,
              status: currentPayment ? currentPayment.status : "pending",
            });
            dueMonths.push(currentMonth);
            totalDueAmount += currentDueAmount;
          }
        }
      }

        if (today.date() >= 15 && transactionStart.isSameOrBefore(today.clone().add(1, "months"), "month") && !dueMonths.includes(nextMonth)) {

        const nextPayment = payments.find(
          (p) =>
            p.transactionId.toString() === transaction._id.toString() &&
            moment(p.monthForPayment).format("YYYY-MM") === nextMonth
        );

        if (!nextPayment || nextPayment.status !== "completed") {
          let nextDueAmount =
            transaction.type === "subscription"
              ? transaction.subscriptionDetails?.pricePerMonth || 0
              : transaction.type === "emi"
              ? transaction.emiDetails?.pricePerMonth || 0
              : 0;

          if (nextDueAmount > 0) {
            dueDetails.push({
              month: nextMonth,
              dueAmount: nextDueAmount,
              status: nextPayment ? nextPayment.status : "pending",
            });
            dueMonths.push(nextMonth);
            totalDueAmount += nextDueAmount;
          }
        }
      }

      if (dueDetails.length > 0) {
        allDues.push({
          transactionId: transaction._id,
          transaction: transaction,
          totalAmountDue: totalDueAmount,
          dueMonths,
          dueDetails,
        });
      }
    }

    return res.status(200).json({
      status: "success",
      data: { user, dues: allDues },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};



export const getAllCustomersDue = async (req, res) => {
  try {
    // Fetch all active transactions
    const transactions = await Transaction.find();

    if (transactions.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        totalDueAmount: 0,
      });
    }

    // Get all customer payments
    const payments = await Payment.find();

    const today = moment();
    const currentMonth = today.format("YYYY-MM");
    const nextMonth = today.clone().add(1, "months").format("YYYY-MM");

    let customerDueMap = new Map(); // Store dues per customer
    let grandTotalDue = 0; // Store total due amount

    for (const transaction of transactions) {
      const customerId = transaction.customerId.toString();
      let dueDetails = [];
      let totalDueAmount = 0;
      let dueMonths = [];

      const transactionStart = moment(transaction.startDate);
      const transactionEnd = transaction.endDate ? moment(transaction.endDate) : null;
      const transactionStartMonth = transactionStart.format("YYYY-MM");

      // Handle One-Time Payments
      if (transaction.type === "oneTimePayment") {
        const paymentRecord = payments.find(
          (p) => p.transactionId.toString() === transaction._id.toString()
        );
        if (!paymentRecord || paymentRecord.status !== "completed") {
          dueDetails.push({
            month: transactionStartMonth,
            dueAmount: transaction.oneTimePaymentAmount || 0,
            status: paymentRecord ? paymentRecord.status : "pending",
          });
          totalDueAmount += transaction.oneTimePaymentAmount || 0;
        }
      }
      // Handle EMI & Subscription Payments
      else {
        let loopDate = transactionStart.clone().startOf("month");

        while (loopDate.isSameOrBefore(today, "month")) {
          const monthString = loopDate.format("YYYY-MM");

          if (transactionEnd && loopDate.isAfter(transactionEnd, "month")) break;

          const paymentRecord = payments.find(
            (p) =>
              p.transactionId.toString() === transaction._id.toString() &&
              moment(p.monthForPayment).format("YYYY-MM") === monthString
          );

          if (!paymentRecord || paymentRecord.status !== "completed") {
            let dueAmount =
              transaction.type === "subscription"
                ? transaction.subscriptionDetails?.pricePerMonth || 0
                : transaction.type === "emi"
                ? transaction.emiDetails?.pricePerMonth || 0
                : 0;

            if (monthString === transactionStartMonth && transaction.type !== "emi") {
              const daysInMonth = loopDate.daysInMonth();
              const startDay = transactionStart.date();
              const usedDays = daysInMonth - startDay + 1;
              dueAmount = (dueAmount / daysInMonth) * usedDays;
            }

            if (dueAmount > 0) {
              dueDetails.push({
                month: monthString,
                dueAmount,
                status: paymentRecord ? paymentRecord.status : "pending",
              });
              dueMonths.push(monthString);
              totalDueAmount += dueAmount;
            }
          }
          loopDate.add(1, "month");
        }
      }

      // Current Month Due Check
      if (transactionStart.isSameOrBefore(today, "month") && !dueMonths.includes(currentMonth)) {
        const currentPayment = payments.find(
          (p) =>
            p.transactionId.toString() === transaction._id.toString() &&
            moment(p.monthForPayment).format("YYYY-MM") === currentMonth
        );

        if (!currentPayment || currentPayment.status !== "completed") {
          let currentDueAmount =
            transaction.type === "subscription"
              ? transaction.subscriptionDetails?.pricePerMonth || 0
              : transaction.type === "emi"
              ? transaction.emiDetails?.pricePerMonth || 0
              : 0;

          if (currentDueAmount > 0) {
            dueDetails.push({
              month: currentMonth,
              dueAmount: currentDueAmount,
              status: currentPayment ? currentPayment.status : "pending",
            });
            dueMonths.push(currentMonth);
            totalDueAmount += currentDueAmount;
          }
        }
      }

      // Next Month Due (if today is past 15th)
      if (today.date() >= 15 && transactionStart.isSameOrBefore(today.clone().add(1, "months"), "month") && !dueMonths.includes(nextMonth)) {
        const nextPayment = payments.find(
          (p) =>
            p.transactionId.toString() === transaction._id.toString() &&
            moment(p.monthForPayment).format("YYYY-MM") === nextMonth
        );

        if (!nextPayment || nextPayment.status !== "completed") {
          let nextDueAmount =
            transaction.type === "subscription"
              ? transaction.subscriptionDetails?.pricePerMonth || 0
              : transaction.type === "emi"
              ? transaction.emiDetails?.pricePerMonth || 0
              : 0;

          if (nextDueAmount > 0) {
            dueDetails.push({
              month: nextMonth,
              dueAmount: nextDueAmount,
              status: nextPayment ? nextPayment.status : "pending",
            });
            dueMonths.push(nextMonth);
            totalDueAmount += nextDueAmount;
          }
        }
      }

      if (dueDetails.length > 0) {
        if (!customerDueMap.has(customerId)) {
          customerDueMap.set(customerId, {
            customerId,
            totalAmountDue: 0,
            transactions: [],
          });
        }
        const customerData = customerDueMap.get(customerId);
        customerData.totalAmountDue += totalDueAmount;
        customerData.transactions.push({
          transactionId: transaction._id,
          transaction,
          totalAmountDue: totalDueAmount,
          dueMonths,
          dueDetails,
        });
        grandTotalDue += totalDueAmount;
      }
    }

    // Fetch customer details from the database
    const customerIds = [...customerDueMap.keys()];
    const customers = await Customer.find({ _id: { $in: customerIds } });

    const finalData = customers.map((customer) => ({
      customerId: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalAmountDue: customerDueMap.get(customer._id.toString())?.totalAmountDue || 0,
      transactions: customerDueMap.get(customer._id.toString())?.transactions || [],
    }));

    // console.log("Final Response:", JSON.stringify({
    //   status: "success",
    //   data: finalData,
    //   totalDueAmount: grandTotalDue
    // }, null, 2));



    return res.status(200).json({
      status: "success",
      data: finalData,
      totalDueAmount: grandTotalDue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

