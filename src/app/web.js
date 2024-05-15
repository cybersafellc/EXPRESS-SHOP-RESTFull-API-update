import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "../middlewares/error-middleware.js";
import userRoute from "../routes/user.js";
import adminRoute from "../routes/admin.js";
import publucRoute from "../routes/public.js";

const web = express();
web.use(cors());
web.use(cookieParser());
web.use(bodyParser.json());
web.use(userRoute);
web.use("/admin", adminRoute);
web.use(publucRoute);
web.use(errorMiddleware.pageNotFound);
web.use(errorMiddleware.errorHandler);
export default web;
