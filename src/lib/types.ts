export type Transaction = {
  id: string;
  type: 'revenue' | 'expense';
  name: string;
  amount: number;
  date: Date;
};

export type Appointment = {
  id: string;
  title: string;
  date: Date;
};
