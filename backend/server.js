// Global Imports
import path from "path";
import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
// Local Imports
import seedRouter from "./src/routes/seedRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";
import uploadRouter from "./src/routes/uploadRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/seed", seedRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const PORT = process.env.PORT || 8080;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.log('Server error:', error);
  process.exit(1);
})
