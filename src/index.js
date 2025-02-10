import cors from "cors";
import dotenv from "dotenv";
import express from "express";

const app = express();

// use middleware
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 7000;
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// console.log("path is ", path.join(__dirname, "uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/src/uploads", express.static(path.join(__dirname, "uploads")));

// database adding
import dbConnection from "./db/db.js";

// routes

// import userRoute from "./routes/user/user.route.js";
import admin from "./routes/admin/user.route.js";
import team from "./routes/team/testimonial.route.js";
import product from "./routes/product/template.route.js";
import websiteInfo from "./routes/websiteInfo/testimonial.route.js";

//  crm=======================================================

import customer from "./routes/customer/testimonial.route.js";
import invoice from "./routes/invoice/invoice.route.js";
import payment from "./routes/payment/payment.route.js";
import template from "./routes/template/template.route.js";
import transaction from "./routes/transaction/template.route.js";
import auth from "./routes/auth/auth.router.js";

// connect to database
dbConnection();

// route
app.use('/api/v1/auth', auth);
app.use("/api/v1/customer", customer);
app.use("/api/v1/invoice", invoice);
app.use("/api/v1/payment", payment);
app.use("/api/v1/template", template);
app.use("/api/v1/product", product);
app.use("/api/v1/transaction", transaction);

// end of crm===================================================





app.use("/api/v1/websiteInfo", websiteInfo);
// app.use("/api/v1/user", userRoute);
app.use("/api/v1/team", team);

// temp
app.use("/api/v1/admin", admin);

// routes

app.get("/", (req, res, next) => {
  console.log("connected");
  res.send("server running");
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
app.listen(port, () => {
  console.log(` server running on port: ${port}`);
});
