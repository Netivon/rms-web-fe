export interface Payment {
  id: string;
  tenancy_id: string;
  amount: number;
  due_date: Date;
  paid_date?: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  month: string;
}