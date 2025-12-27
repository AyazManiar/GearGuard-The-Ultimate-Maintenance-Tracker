import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const requestSchema = z.object({
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  type: z.enum(['corrective', 'preventive'] as const),
  equipmentId: z.string().min(1, 'Please select equipment'),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  scheduledDate: z.date().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function RequestFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedEquipmentId = searchParams.get('equipmentId');
  
  const { equipment, getEquipmentById, addRequest } = useApp();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subject: '',
      description: '',
      type: 'corrective',
      equipmentId: preselectedEquipmentId || '',
      priority: 'medium',
      notes: '',
    },
  });

  const requestType = form.watch('type');
  const selectedEquipmentId = form.watch('equipmentId');
  const selectedEquipment = selectedEquipmentId ? getEquipmentById(selectedEquipmentId) : undefined;

  // Auto-fill logic when equipment is selected
  useEffect(() => {
    if (selectedEquipment) {
      // The team will be auto-filled when the request is created
    }
  }, [selectedEquipment]);

  const onSubmit = (data: RequestFormValues) => {
    try {
      // Validation for preventive maintenance
      if (data.type === 'preventive' && !data.scheduledDate) {
        form.setError('scheduledDate', {
          type: 'manual',
          message: 'Scheduled date is required for preventive maintenance'
        });
        return;
      }

      const formData = {
        subject: data.subject,
        type: data.type,
        equipmentId: data.equipmentId,
        priority: data.priority,
        description: data.description,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
      };

      addRequest(formData);
      toast({
        title: "Request created",
        description: `Maintenance request "${data.subject}" has been created.`
      });
      navigate('/requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="New Maintenance Request"
        description="Create a new maintenance request"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Requests', href: '/requests' },
          { label: 'New' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/requests')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Oil Leak Detected" {...field} />
                      </FormControl>
                      <FormDescription>Brief description of the issue</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Request Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
                          <SelectItem value="preventive">Preventive (Scheduled)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === 'corrective' 
                          ? 'Unplanned repair due to breakdown' 
                          : 'Planned routine maintenance'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Equipment */}
                <FormField
                  control={form.control}
                  name="equipmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equipment.filter(e => e.isActive).map(eq => (
                            <SelectItem key={eq.id} value={eq.id}>
                              {eq.name} ({eq.serialNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Auto-filled Team Info */}
                {selectedEquipment && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Auto-assigned Team</p>
                    <p className="font-medium">
                      {selectedEquipment.maintenanceTeamId 
                        ? `Team will be auto-assigned based on equipment settings`
                        : 'No team assigned to this equipment'}
                    </p>
                  </div>
                )}

                {/* Scheduled Date (for preventive) */}
                {requestType === 'preventive' && (
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When should this maintenance occur?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the issue or maintenance required..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate('/requests')}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
