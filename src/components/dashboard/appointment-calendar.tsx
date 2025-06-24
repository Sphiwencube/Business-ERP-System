"use client";

import { useState } from 'react';
import type { Appointment } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddOrUpdate: (data: Omit<Appointment, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

const appointmentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date(),
});

export function AppointmentCalendar({
  appointments,
  onAddOrUpdate,
  onDelete,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isListOpen, setIsListOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsListOpen(true);
    }
  };
  
  const handleOpenForm = (appointment?: Appointment) => {
    setEditingAppointment(appointment);
    form.reset(appointment || { title: '', date: selectedDate || new Date() });
    setIsFormOpen(true);
  };
  
  function onSubmit(values: z.infer<typeof appointmentSchema>) {
    onAddOrUpdate({ id: editingAppointment?.id, ...values });
    toast({
      title: `Appointment ${editingAppointment ? 'updated' : 'added'}`,
      description: `Successfully ${editingAppointment ? 'updated' : 'added'} "${values.title}".`,
    });
    setIsFormOpen(false);
    setEditingAppointment(undefined);
  }

  const appointmentsOnSelectedDay = selectedDate
    ? appointments.filter((a) => isSameDay(a.date, selectedDate))
    : [];
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{ scheduled: appointments.map((a) => a.date) }}
            modifiersStyles={{
              scheduled: {
                color: 'hsl(var(--accent-foreground))',
                backgroundColor: 'hsl(var(--accent))',
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Appointments for {selectedDate ? format(selectedDate, 'PPP') : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {appointmentsOnSelectedDay.length > 0 ? (
              appointmentsOnSelectedDay.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-md bg-secondary p-3">
                  <p className="font-medium">{app.title}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(app)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(app.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No appointments scheduled for this day.</p>
            )}
          </div>
          <DialogFooter>
             <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAppointment ? 'Edit' : 'Add'} Appointment</DialogTitle>
            <DialogDescription>
              {editingAppointment ? 'Update the details of your appointment.' : `Schedule a new appointment for ${selectedDate ? format(selectedDate, 'PPP') : ''}.`}
            </DialogDescription>
          </DialogHeader>
           <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Meeting with Client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                  <Button type="submit">{editingAppointment ? 'Save Changes' : 'Schedule'}</Button>
                </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
