import React, { useState } from 'react';
import { PageHeader, StatusBadge, PriorityBadge } from '@/components/common';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatDate, cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { getAllRequestsWithRelations } = useApp();
  const allRequests = getAllRequestsWithRelations();
  
  // Filter for preventive maintenance with scheduled dates
  const scheduledRequests = allRequests.filter(r => r.scheduledDate);
  
  // Get requests for selected date
  const selectedDateRequests = selectedDate 
    ? scheduledRequests.filter(r => r.scheduledDate && isSameDay(new Date(r.scheduledDate), selectedDate))
    : [];
  
  // Get days that have scheduled maintenance
  const daysWithMaintenance = scheduledRequests
    .map(r => r.scheduledDate ? new Date(r.scheduledDate) : null)
    .filter(Boolean) as Date[];

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div>
      <PageHeader
        title="Maintenance Calendar"
        description="View and schedule preventive maintenance"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Calendar' }]}
        actions={
          <Button asChild>
            <Link to="/requests/new">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="rounded-md border pointer-events-auto w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "hidden",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: cn(
                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                  "w-full h-12"
                ),
                day: cn(
                  "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
                  "flex items-center justify-center"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
              modifiers={{
                hasMaintenance: daysWithMaintenance,
              }}
              modifiersClassNames={{
                hasMaintenance: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-center py-8">
                Click on a date to view scheduled maintenance
              </p>
            ) : selectedDateRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No maintenance scheduled</p>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/requests/new`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule for this date
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateRequests.map(request => (
                  <div 
                    key={request.id} 
                    className={`p-4 rounded-lg bg-muted/50 border-l-4 ${
                      request.isOverdue ? 'border-destructive' : 'border-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={request.status} />
                      {request.isOverdue && (
                        <span className="text-xs text-destructive font-medium">OVERDUE</span>
                      )}
                    </div>
                    <h4 className="font-medium text-sm">{request.subject}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{request.equipment?.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <PriorityBadge priority={request.priority} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {request.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Scheduled Maintenance */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Scheduled Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledRequests
              .filter(r => r.scheduledDate && new Date(r.scheduledDate) >= new Date())
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
              .slice(0, 5)
              .map(request => (
                <div key={request.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(request.scheduledDate!).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.scheduledDate!), 'MMM')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.subject}</h4>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{request.equipment?.name}</p>
                  </div>
                  <PriorityBadge priority={request.priority} />
                </div>
              ))}
            {scheduledRequests.filter(r => r.scheduledDate && new Date(r.scheduledDate) >= new Date()).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No upcoming scheduled maintenance</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
