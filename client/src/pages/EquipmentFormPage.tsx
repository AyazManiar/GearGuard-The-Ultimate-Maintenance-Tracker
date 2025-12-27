import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { EquipmentCategory } from '@/types';

const equipmentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  serialNumber: z.string()
    .min(3, 'Serial number must be at least 3 characters')
    .max(50, 'Serial number must be less than 50 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Serial number can only contain letters, numbers, and dashes')
    .trim(),
  category: z.enum(['machine', 'vehicle', 'computer', 'other'] as const),
  departmentId: z.string().min(1, 'Please select a department'),
  assignedEmployeeId: z.string().optional(),
  maintenanceTeamId: z.string().min(1, 'Please select a maintenance team'),
  defaultTechnicianId: z.string().optional(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
  purchaseDate: z.date({ required_error: 'Please select a purchase date' }),
  warrantyExpiryDate: z.date().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

export default function EquipmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    departments, 
    employees, 
    teams, 
    getEquipmentById, 
    addEquipment, 
    updateEquipment 
  } = useApp();

  const isEditing = id && id !== 'new';
  const existingEquipment = isEditing ? getEquipmentById(id) : undefined;

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: existingEquipment ? {
      name: existingEquipment.name,
      serialNumber: existingEquipment.serialNumber,
      category: existingEquipment.category,
      departmentId: existingEquipment.departmentId,
      assignedEmployeeId: existingEquipment.assignedEmployeeId || '',
      maintenanceTeamId: existingEquipment.maintenanceTeamId,
      defaultTechnicianId: existingEquipment.defaultTechnicianId || '',
      location: existingEquipment.location,
      purchaseDate: new Date(existingEquipment.purchaseDate),
      warrantyExpiryDate: existingEquipment.warrantyExpiryDate ? new Date(existingEquipment.warrantyExpiryDate) : undefined,
      notes: existingEquipment.notes || '',
    } : {
      name: '',
      serialNumber: '',
      category: 'machine' as EquipmentCategory,
      departmentId: '',
      assignedEmployeeId: '',
      maintenanceTeamId: '',
      defaultTechnicianId: '',
      location: '',
      purchaseDate: new Date(),
      notes: '',
    },
  });

  const selectedTeamId = form.watch('maintenanceTeamId');
  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const teamMembers = selectedTeam ? employees.filter(e => selectedTeam.memberIds.includes(e.id)) : [];

  const onSubmit = (data: EquipmentFormValues) => {
    try {
      const formData = {
        name: data.name,
        serialNumber: data.serialNumber,
        category: data.category,
        departmentId: data.departmentId,
        maintenanceTeamId: data.maintenanceTeamId,
        location: data.location,
        purchaseDate: data.purchaseDate,
        assignedEmployeeId: data.assignedEmployeeId || undefined,
        defaultTechnicianId: data.defaultTechnicianId || undefined,
        warrantyExpiryDate: data.warrantyExpiryDate,
        notes: data.notes,
      };
      
      if (isEditing && existingEquipment) {
        updateEquipment(existingEquipment.id, formData);
        toast({
          title: "Equipment updated",
          description: `${data.name} has been updated successfully.`
        });
      } else {
        addEquipment(formData);
        toast({
          title: "Equipment added",
          description: `${data.name} has been added successfully.`
        });
      }
      navigate('/equipment');
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
        title={isEditing ? 'Edit Equipment' : 'Add New Equipment'}
        description={isEditing ? `Update ${existingEquipment?.name}` : 'Register a new piece of equipment'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Equipment', href: '/equipment' },
          { label: isEditing ? 'Edit' : 'New' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/equipment')}>
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
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CNC Machine Alpha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Serial Number */}
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CNC-2024-001" {...field} />
                      </FormControl>
                      <FormDescription>Letters, numbers, and dashes only</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="machine">Machine</SelectItem>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="computer">Computer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department */}
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Production Floor - Bay 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Maintenance Team */}
                <FormField
                  control={form.control}
                  name="maintenanceTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Team *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map(team => (
                            <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Team responsible for this equipment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default Technician */}
                <FormField
                  control={form.control}
                  name="defaultTechnicianId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Technician</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!selectedTeamId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedTeamId ? "Select technician" : "Select team first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Date */}
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Purchase Date *</FormLabel>
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
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Warranty Expiry */}
                <FormField
                  control={form.control}
                  name="warrantyExpiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Warranty Expiry Date</FormLabel>
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
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assigned Employee */}
                <FormField
                  control={form.control}
                  name="assignedEmployeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Employee</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Who uses this equipment</FormDescription>
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
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this equipment..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Max 500 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => navigate('/equipment')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Equipment' : 'Add Equipment'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
