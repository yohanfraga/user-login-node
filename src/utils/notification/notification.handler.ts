import { ZodIssue } from "zod";
import { Notification } from "./notification.types";

export class NotificationHandler {
    private notifications: Notification[] = [];

    public addNotification = (path: string, message: string) => {
        this.notifications.push({ path, message });
    }

    public getNotifications = () => {
        return this.notifications;
    }

    public clearNotifications = () => {
        this.notifications.length = 0;
    }

    public hasNotifications = () => {
        return this.notifications.length > 0;
    }

    public addValidationNotifications = (path: string, issues: ZodIssue[]) => {
        for (const issue of issues) {
            this.notifications.push({ path, message: `Field ${issue.path} ${issue.message}` });
        }
    }
}

export const notificationHandler = new NotificationHandler();