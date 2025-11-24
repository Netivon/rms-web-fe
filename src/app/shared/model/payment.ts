export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  date: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  month: string;
}