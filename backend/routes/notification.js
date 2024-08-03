import express from "express";
import {
  getNotifications,
  deleteNotification,
  deleteNotifications,
} from "../controllers/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get("/", getNotifications);
notificationRoute.delete("/", deleteNotifications);
notificationRoute.delete("/:id", deleteNotification);

export default notificationRoute;
