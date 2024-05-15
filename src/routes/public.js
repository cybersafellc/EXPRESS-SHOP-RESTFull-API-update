import express from "express";
import productsController from "../controllers/products-controller.js";
import orderController from "../controllers/order-controller.js";

const router = express.Router();
router.use("/products/images", express.static("./src/static/images"));
router.get("/products", productsController.get);
router.post("/weebhook/midtrans/status", orderController.weebhookMidtrans);
export default router;
