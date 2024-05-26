import express from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import accessTokenVerify from "../controllers/access_token_response.js";
import addressController from "../controllers/address-controller.js";
import cartController from "../controllers/cart-controller.js";
import orderController from "../controllers/order-controller.js";

const router = express.Router();
router.post("/users", userController.create);
router.post("/users/login", userController.login);
router.post("/users/forget-password", userController.resetPassword);
router.put("/users/forget-password/new-password", userController.newPassword);
router.post(
  "/users/refresh-token",
  authMiddleware.userRefreshToken,
  userController.refreshToken
);
router.get(
  "/users/verify-token/reset-password",
  authMiddleware.resePasswordToken,
  userController.resePasswordToken
);

router.get("/users/verify-token", authMiddleware.user, accessTokenVerify);
router.post("/address", authMiddleware.user, addressController.create);
router.get("/address", authMiddleware.user, addressController.get);
router.put("/address", authMiddleware.user, addressController.update);
router.delete("/address", authMiddleware.user, addressController.deletes);

router.post("/carts", authMiddleware.user, cartController.create);
router.get("/carts", authMiddleware.user, cartController.get);
router.put("/carts", authMiddleware.user, cartController.update);
router.delete("/carts", authMiddleware.user, cartController.deletes);
router.delete("/carts/clear", authMiddleware.user, cartController.deleteClear);

router.post("/orders", authMiddleware.user, orderController.cekout);
router.get("/orders", authMiddleware.user, orderController.getAll);
export default router;
