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

    if (req.file) {
      // Save the file path to the database
      const imagePath = `/uploads/${req.file.filename}`;
      data.logoImage = imagePath;
    }

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
export const getUsers = async (req, res, next) => {
  try {
    const users = await getJobsApi();
    return res.status(201).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};

export const getUserWithPayment2 = async (req, res, next) => {
  try {
    const { _id } = req.params; // Get customer ID from request params

    // 1️⃣ Fetch Customer Data
    const user = await getJobApi(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    }

    // 2️⃣ Get All Active Transactions for the Customer
    const transactions = await Transaction.find({
      customerId: _id,
      status: "active",
    });
    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ status: "success", data: { user, dues: [] } });
    }

    // 3️⃣ Get Payment History for Customer
    const payments = await Payment.find({ customerId: _id });

    // 4️⃣ Calculate Due Amounts
    const today = moment();
    const currentMonth = today.format("YYYY-MM"); // Example: "2025-02"
    const previousMonth = today.clone().subtract(1, "months").format("YYYY-MM");
    const nextMonth = today.clone().add(1, "months").format("YYYY-MM");

    let allDues = [];

    for (const transaction of transactions) {
      let dueDetails = [];
      let totalDueAmount = 0;
      let dueMonths = [];

      const transactionStart = moment(transaction.startDate);
      const transactionEnd = transaction.endDate
        ? moment(transaction.endDate)
        : null;

      // Loop through months from transaction start until today
      let loopDate = transactionStart.clone().startOf("month");

      while (loopDate.isSameOrBefore(today, "month")) {
        const monthString = loopDate.format("YYYY-MM");

        // Stop if endDate exists and the month is beyond it
        if (transactionEnd && loopDate.isAfter(transactionEnd, "month")) break;

        // Check if payment exists for this month
        const paymentRecord = payments.find(
          (p) =>
            p.transactionId.toString() === transaction._id.toString() &&
            moment(p.monthForPayment).format("YYYY-MM") === monthString
        );

        if (!paymentRecord || paymentRecord.status !== "completed") {
          // Calculate due amount based on transaction type
          let dueAmount = 0;

          if (transaction.type === "subscription") {
            dueAmount = transaction.subscriptionDetails?.pricePerMonth || 0;
          } else if (transaction.type === "emi") {
            dueAmount = transaction.emiDetails?.pricePerMonth || 0;
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

        // Move to the next month
        loopDate.add(1, "month");
      }

      // Ensure Current Month is Included if Unpaid
      if (!dueMonths.includes(currentMonth)) {
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

      // Include Next Month's Due if Today is 15th or Later
      if (today.date() >= 15 && !dueMonths.includes(nextMonth)) {
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

      // If the transaction has due payments, add it to the response
      if (dueDetails.length > 0) {
        allDues.push({
          transactionId: transaction._id,
          totalAmountDue: totalDueAmount,
          dueMonths,
          dueDetails,
        });
      }
    }

    // Return Response
    return res.status(200).json({
      status: "success",
      data: { user, dues: allDues },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getUserWithPayment3 = async (req, res, next) => {
  try {
    const { _id } = req.params; // Get customer ID from request params

    // 1️⃣ Fetch Customer Data
    const user = await getJobApi(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    }

    // 2️⃣ Get All Active Transactions for the Customer
    const transactions = await Transaction.find({
      customerId: _id,
      status: "active",
    });
    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ status: "success", data: { user, dues: [] } });
    }

    // 3️⃣ Get Payment History for Customer
    const payments = await Payment.find({ customerId: _id });

    // 4️⃣ Calculate Due Amounts
    const today = moment();
    const currentMonth = today.format("YYYY-MM"); // Example: "2025-02"
    const previousMonth = today.clone().subtract(1, "months").format("YYYY-MM");
    const nextMonth = today.clone().add(1, "months").format("YYYY-MM");

    let allDues = [];

    for (const transaction of transactions) {
      let dueDetails = [];
      let totalDueAmount = 0;
      let dueMonths = [];

      // Handle One-Time Payments 🚀
      if (transaction.type === "oneTimePayment") {
        const oneTimePaymentRecord = payments.find(
          (p) => p.transactionId.toString() === transaction._id.toString()
        );

        if (
          !oneTimePaymentRecord ||
          oneTimePaymentRecord.status !== "completed"
        ) {
          const dueAmount = transaction.oneTimePaymentAmount || 0;

          if (dueAmount > 0) {
            dueDetails.push({
              month: "One-Time Payment",
              dueAmount,
              status: oneTimePaymentRecord
                ? oneTimePaymentRecord.status
                : "pending",
            });

            totalDueAmount += dueAmount;
          }
        }
      } else {
        // Handle Subscription & EMI Payments 💳
        const transactionStart = moment(transaction.startDate);
        const transactionEnd = transaction.endDate
          ? moment(transaction.endDate)
          : null;

        // Loop through months from transaction start until today
        let loopDate = transactionStart.clone().startOf("month");

        while (loopDate.isSameOrBefore(today, "month")) {
          const monthString = loopDate.format("YYYY-MM");

          // Stop if endDate exists and the month is beyond it
          if (transactionEnd && loopDate.isAfter(transactionEnd, "month"))
            break;

          // Check if payment exists for this month
          const paymentRecord = payments.find(
            (p) =>
              p.transactionId.toString() === transaction._id.toString() &&
              moment(p.monthForPayment).format("YYYY-MM") === monthString
          );

          if (!paymentRecord || paymentRecord.status !== "completed") {
            // Calculate due amount based on transaction type
            let dueAmount = 0;

            if (transaction.type === "subscription") {
              dueAmount = transaction.subscriptionDetails?.pricePerMonth || 0;
            } else if (transaction.type === "emi") {
              dueAmount = transaction.emiDetails?.pricePerMonth || 0;
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

          // Move to the next month
          loopDate.add(1, "month");
        }

        // Ensure Current Month is Included if Unpaid
        if (!dueMonths.includes(currentMonth)) {
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

        // Include Next Month's Due if Today is 15th or Later
        if (today.date() >= 15 && !dueMonths.includes(nextMonth)) {
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
      }

      // If the transaction has due payments, add it to the response
      if (dueDetails.length > 0) {
        allDues.push({
          transactionId: transaction._id,
          totalAmountDue: totalDueAmount,
          dueMonths,
          dueDetails,
        });
      }
    }

    // Return Response
    return res.status(200).json({
      status: "success",
      data: { user, dues: allDues },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getUserWithPayment4 = async (req, res, next) => {
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

            if (monthString === transactionStartMonth) {
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

      if (!dueMonths.includes(currentMonth)) {
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

      if (today.date() >= 5 && !dueMonths.includes(nextMonth)) {
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

