import { ZodIssue } from "zod";
import { Notification } from "./notification.types";

const notifications: Notification[] = [];

export const addNotification = (path: string, message: string) => {
    notifications.push({ path, message });
}

export const getNotifications = () => {
    return notifications;
}

export const clearNotifications = () => {
    notifications.length = 0;
}

export const hasNotifications = () => {
    return notifications.length > 0;
}

export const addValidationNotifications = (path: string, issues: ZodIssue[]) => {
    for (const issue of issues) {
        notifications.push({ path, message: `Field ${issue.path} ${issue.message}` });
    }
}