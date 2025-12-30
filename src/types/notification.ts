export interface NotificationPayload {
    [key: string]: StringConstructor; 
}


type NotificationType = 'group_invitation' | 'friend_request' | 'system_alert';
type EventStatus = 'pending' | 'success' | 'failed';

export interface NotificationData {
    recipientRowId: number;
    recipientUserId: number;
    readAt: string | null;
    eventStatus: EventStatus;
    actorUserId: number;
    eventId: number;
    title: string;
    body: string;
    notificationImage: string;
    payload: NotificationPayload;
    notificationType: NotificationType;
    createdAt: string;
}