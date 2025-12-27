import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader, StatCard } from '@/components/common';
import { Wrench, ClipboardList, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/common';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const { getDashboardStats, getAllRequestsWithRelations, loading } = useApp();
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeEquipment: 0,
    totalRequests: 0,
    openRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    overdueRequests: 0,
    totalTeams: 0,
    avgRepairTime: 0
  });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, [getDashboardStats]);

  const recentRequests = getAllRequestsWithRelations()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your maintenance operations"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Equipment"
          value={stats.totalEquipment}
          icon={Wrench}
          variant="primary"
        />
        <StatCard
          title="Open Requests"
          value={stats.openRequests}
          icon={ClipboardList}
          variant="warning"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressRequests}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Completed"
          value={stats.completedRequests}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Maintenance Teams"
          value={stats.totalTeams}
          icon={Users}
        />
        <StatCard
          title="Overdue Requests"
          value={stats.overdueRequests}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Avg. Repair Time"
          value={`${stats.avgRepairTime}h`}
          icon={Clock}
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Maintenance Requests</CardTitle>
          <Link to="/requests" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-foreground">{request.subject}</h4>
                    <StatusBadge status={request.status} />
                    <PriorityBadge priority={request.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {request.equipment?.name} • {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
