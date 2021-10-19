import { NotificationManager } from "react-notifications";

export const NOTIFICATION_TIMEOUT = 4000;

export const successNotification = (message) => {
  NotificationManager.success(message, "", NOTIFICATION_TIMEOUT);
};

export const errorNotification = (message) => {
  NotificationManager.error(message, "", NOTIFICATION_TIMEOUT);
};
