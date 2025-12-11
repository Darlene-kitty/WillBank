export interface Notification {
  id?: number;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  recipient: string;
  subject: string;
  message: string;
  status?: 'SENT' | 'PENDING' | 'FAILED';
  sentAt?: Date;
  createdAt?: Date;
}
