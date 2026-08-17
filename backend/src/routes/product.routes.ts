import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = Router();
const productController = new ProductController();

router.use(authenticate);

router.post("/", validate(createProductSchema), (req, res) =>
  productController.create(req, res),
);

router.get("/", (req, res) => productController.getAll(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));
router.put("/:id", validate(updateProductSchema), (req, res) =>
  productController.update(req, res),
);
router.delete("/:id", (req, res) => productController.delete(req, res));

export default router;
