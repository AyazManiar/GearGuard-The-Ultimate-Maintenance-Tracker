import React from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, StatusBadge } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Cog, Car, Monitor, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

const categoryIcons = {
  machine: Cog,
  vehicle: Car,
  computer: Monitor,
  other: Package
};

export default function EquipmentPage() {
  const { getAllEquipmentWithRelations } = useApp();
  const equipment = getAllEquipmentWithRelations();

  return (
    <div>
      <PageHeader
        title="Equipment"
        description="Manage all company assets and machinery"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Equipment' }]}
        actions={
          <Button asChild>
            <Link to="/equipment/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map(item => {
          const Icon = categoryIcons[item.category] || Package;
          return (
            <Link to={`/equipment/${item.id}`} key={item.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <StatusBadge status={item.isActive ? 'active' : 'inactive'} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.serialNumber}</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Location:</span> {item.location}</p>
                    <p><span className="text-muted-foreground">Department:</span> {item.department?.name}</p>
                    <p><span className="text-muted-foreground">Team:</span> {item.maintenanceTeam?.name}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Purchased: {formatDate(item.purchaseDate)}
                    </span>
                    {item.openRequestCount && item.openRequestCount > 0 && (
                      <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded">
                        {item.openRequestCount} open
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
