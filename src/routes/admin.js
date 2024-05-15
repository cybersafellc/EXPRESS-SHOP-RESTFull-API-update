import express from "express";
import adminController from "../controllers/admin-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import accessTokenVerify from "../controllers/access_token_response.js";
import { multers } from "../middlewares/multer-middleware.js";
import productsController from "../controllers/products-controller.js";

const router = express();
router.post("/login", adminController.login);
router.post(
  "/refresh-token",
  authMiddleware.adminRefreshToken,
  adminController.refreshToken
);

router.get("/verify-token", authMiddleware.admin, accessTokenVerify);
router.get("/users", authMiddleware.admin, adminController.getUsers);
router.post("/users/locked", authMiddleware.admin, adminController.lockedUsers);
router.post(
  "/products/images",
  authMiddleware.admin,
  multers,
  productsController.imageUpload
);
router.post("/products", authMiddleware.admin, productsController.create);
router.put("/products", authMiddleware.admin, productsController.update);
router.delete("/products", authMiddleware.admin, productsController.deletes);

export default router;
