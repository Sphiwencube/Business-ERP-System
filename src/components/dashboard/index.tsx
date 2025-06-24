"use client";

import { useState, useMemo } from 'react';
import type { Transaction, Appointment } from '@/lib/types';
import { addDays, startOfToday } from 'date-fns';
import { DollarSign, CreditCard, Wallet, PlusCircle } from 'lucide-react';
import { MetricCard } from './metric-card';
import { TransactionsView } from './transactions-view';
import { AppointmentCalendar } from './appointment-calendar';
import { Logo } from '../logo';
import { Button } from '@/components/ui/button';

const initialTransactions: Transaction[] = [
  { id: '1', type: 'revenue', name: 'Website Design', amount: 2500, date: new Date() },
  { id: '2', type: 'expense', name: 'Software Subscription', amount: 75, date: addDays(new Date(), -5) },
  { id: '3', type: 'revenue', name: 'Logo Design', amount: 800, date: addDays(new Date(), -2) },
  { id: '4', type: 'expense', name: 'Office Supplies', amount: 120, date: addDays(new Date(), -10) },
];

const initialAppointments: Appointment[] = [
  { id: '1', title: 'Client Meeting - Project Kickoff', date: startOfToday() },
  { id: '2', title: 'Follow-up with Acme Corp', date: addDays(startOfToday(), 2) },
  { id: '3', title: 'Design Presentation', date: addDays(startOfToday(), 5) },
];

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const { totalRevenue, totalExpenses, profit } = useMemo(() => {
    const totalRevenue = transactions
      .filter((t) => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const profit = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, profit };
  }, [transactions]);

  const handleAddOrUpdateTransaction = (transaction: Omit<Transaction, 'id'> & { id?: string }) => {
    if (transaction.id) {
      setTransactions(transactions.map((t) => (t.id === transaction.id ? { ...t, ...transaction } : t)));
    } else {
      setTransactions([...transactions, { ...transaction, id: crypto.randomUUID() }]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };
  
  const handleOpenTransactionForm = () => {
    setEditingTransaction(undefined);
    setIsTransactionFormOpen(true);
  }

  const handleAddOrUpdateAppointment = (appointment: Omit<Appointment, 'id'> & { id?: string }) => {
    if (appointment.id) {
        setAppointments(appointments.map((a) => (a.id === appointment.id ? { ...a, ...appointment } : a)));
    } else {
        setAppointments([...appointments, { ...appointment, id: crypto.randomUUID() }]);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Button onClick={handleOpenTransactionForm} className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Revenue"
              amount={totalRevenue}
              icon={DollarSign}
              description="All income received."
            />
            <MetricCard
              title="Total Expenses"
              amount={totalExpenses}
              icon={CreditCard}
              description="All money spent."
            />
            <MetricCard
              title="Net Profit"
              amount={profit}
              icon={Wallet}
              description="Revenue minus expenses."
            />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionsView
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                isFormOpen={isTransactionFormOpen}
                setIsFormOpen={setIsTransactionFormOpen}
                editingTransaction={editingTransaction}
                onFormSubmit={handleAddOrUpdateTransaction}
              />
            </div>
            <div className="lg:col-span-1">
              <AppointmentCalendar
                appointments={appointments}
                onAddOrUpdate={handleAddOrUpdateAppointment}
                onDelete={handleDeleteAppointment}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
