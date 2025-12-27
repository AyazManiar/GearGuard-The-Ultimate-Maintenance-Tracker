import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageHeader, StatusBadge, PriorityBadge } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  MapPin, 
  Calendar, 
  Shield, 
  Users, 
  User, 
  Edit, 
  Trash2,
  ArrowLeft,
  Cog,
  Car,
  Monitor,
  Package
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const categoryIcons = {
  machine: Cog,
  vehicle: Car,
  computer: Monitor,
  other: Package
};

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEquipmentWithRelations, getRequestsForEquipment, deleteEquipment, getOpenRequestCountForEquipment } = useApp();
  
  const equipment = id ? getEquipmentWithRelations(id) : undefined;
  const requests = id ? getRequestsForEquipment(id) : [];
  const openRequestCount = id ? getOpenRequestCountForEquipment(id) : 0;

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">Equipment not found</h2>
        <Button asChild variant="outline">
          <Link to="/equipment">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment
          </Link>
        </Button>
      </div>
    );
  }

  const Icon = categoryIcons[equipment.category] || Package;

  const handleDelete = () => {
    deleteEquipment(equipment.id);
    toast({
      title: "Equipment deleted",
      description: `${equipment.name} has been removed.`
    });
    navigate('/equipment');
  };

  return (
    <div>
      <PageHeader
        title={equipment.name}
        description={equipment.serialNumber}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Equipment', href: '/equipment' },
          { label: equipment.name }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to={`/equipment/${equipment.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Equipment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {equipment.name} and all associated maintenance requests. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{equipment.name}</CardTitle>
                    <p className="text-muted-foreground">{equipment.serialNumber}</p>
                  </div>
                </div>
                <StatusBadge status={equipment.isActive ? 'active' : 'inactive'} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{equipment.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <p className="font-medium">{formatDate(equipment.purchaseDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Warranty Expires</p>
                    <p className="font-medium">{formatDate(equipment.warrantyExpiryDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{equipment.department?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {equipment.notes && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-foreground">{equipment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Requests - Smart Button Implementation */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>Maintenance Requests</CardTitle>
                {/* Smart Button Badge */}
                <Badge variant={openRequestCount > 0 ? "destructive" : "secondary"}>
                  {openRequestCount} open
                </Badge>
              </div>
              <Button asChild size="sm">
                <Link to={`/requests/new?equipmentId=${equipment.id}`}>
                  <Wrench className="h-4 w-4 mr-2" />
                  New Request
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No maintenance requests for this equipment.</p>
              ) : (
                <div className="space-y-3">
                  {requests.map(request => (
                    <div 
                      key={request.id} 
                      className={`flex items-center justify-between p-4 rounded-lg bg-muted/50 ${request.isOverdue ? 'border-l-4 border-destructive' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{request.subject}</h4>
                          <StatusBadge status={request.status} />
                          <PriorityBadge priority={request.priority} />
                          {request.isOverdue && (
                            <span className="text-xs text-destructive font-medium">OVERDUE</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.type === 'preventive' ? 'Preventive' : 'Corrective'} • {formatDate(request.createdAt)}
                        </p>
                      </div>
                      {request.assignedTechnician && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {request.assignedTechnician.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Maintenance Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{equipment.maintenanceTeam?.name || 'Not assigned'}</p>
                  <p className="text-sm text-muted-foreground">{equipment.maintenanceTeam?.description}</p>
                </div>
              </div>
              {equipment.defaultTechnician && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Default Technician</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {equipment.defaultTechnician.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{equipment.defaultTechnician.name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Employee */}
          {equipment.assignedEmployee && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {equipment.assignedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{equipment.assignedEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">{equipment.assignedEmployee.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
