import React from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, StatusBadge, PriorityBadge } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { RequestStatus } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const columns: { id: RequestStatus; title: string }[] = [
  { id: 'new', title: 'New' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'repaired', title: 'Repaired' },
  { id: 'scrap', title: 'Scrap' }
];

export default function RequestsPage() {
  const { getAllRequestsWithRelations, updateRequestStatus } = useApp();
  const requests = getAllRequestsWithRelations();

  const handleDragStart = (e: React.DragEvent, requestId: string) => {
    e.dataTransfer.setData('requestId', requestId);
  };

  const handleDrop = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    const requestId = e.dataTransfer.getData('requestId');
    updateRequestStatus(requestId, status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <PageHeader
        title="Maintenance Requests"
        description="Track and manage all maintenance work"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Requests' }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-muted/30 rounded-lg p-4 min-h-[500px]"
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {requests.filter(r => r.status === column.id).length}
              </span>
            </div>
            <div className="space-y-3">
              {requests
                .filter(r => r.status === column.id)
                .map(request => (
                  <div
                    key={request.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request.id)}
                    className={`bg-card rounded-lg p-4 shadow-sm cursor-move hover:shadow-md transition-shadow border ${
                      request.isOverdue ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    {request.isOverdue && (
                      <div className="text-xs text-destructive font-medium mb-2">OVERDUE</div>
                    )}
                    <h4 className="font-medium text-foreground text-sm mb-2">{request.subject}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{request.equipment?.name}</p>
                    <div className="flex items-center justify-between">
                      <PriorityBadge priority={request.priority} />
                      {request.assignedTechnician && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                            {request.assignedTechnician.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(request.createdAt)}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
