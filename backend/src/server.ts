import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import productRouter from "./routes/product.routes";
import cors from  "cors"
import { errorHandler } from "./middlewares/error.middleware";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

// Rotalar
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});