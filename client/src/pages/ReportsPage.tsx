import React from 'react';
import { PageHeader } from '@/components/common';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const STATUS_COLORS = {
  new: '#3b82f6',
  in_progress: '#f59e0b',
  repaired: '#10b981',
  scrap: '#ef4444'
};

export default function ReportsPage() {
  const { getAllRequestsWithRelations, getAllTeamsWithRelations, equipment, departments } = useApp();
  const requests = getAllRequestsWithRelations();
  const teams = getAllTeamsWithRelations();

  // Requests by Team
  const requestsByTeam = teams.map(team => ({
    name: team.name,
    total: requests.filter(r => r.maintenanceTeamId === team.id).length,
    open: requests.filter(r => r.maintenanceTeamId === team.id && r.status !== 'repaired' && r.status !== 'scrap').length,
    completed: requests.filter(r => r.maintenanceTeamId === team.id && r.status === 'repaired').length
  }));

  // Requests by Category
  const categories = ['machine', 'vehicle', 'computer', 'other'];
  const requestsByCategory = categories.map(category => {
    const categoryEquipment = equipment.filter(e => e.category === category);
    const categoryRequests = requests.filter(r => 
      categoryEquipment.some(eq => eq.id === r.equipmentId)
    );
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categoryRequests.length
    };
  }).filter(c => c.value > 0);

  // Requests by Status
  const requestsByStatus = [
    { name: 'New', value: requests.filter(r => r.status === 'new').length, color: STATUS_COLORS.new },
    { name: 'In Progress', value: requests.filter(r => r.status === 'in_progress').length, color: STATUS_COLORS.in_progress },
    { name: 'Repaired', value: requests.filter(r => r.status === 'repaired').length, color: STATUS_COLORS.repaired },
    { name: 'Scrap', value: requests.filter(r => r.status === 'scrap').length, color: STATUS_COLORS.scrap }
  ].filter(s => s.value > 0);

  // Requests by Type
  const requestsByType = [
    { name: 'Corrective', value: requests.filter(r => r.type === 'corrective').length },
    { name: 'Preventive', value: requests.filter(r => r.type === 'preventive').length }
  ];

  // Equipment by Department
  const equipmentByDept = departments.map(dept => ({
    name: dept.name,
    active: equipment.filter(e => e.departmentId === dept.id && e.isActive).length,
    inactive: equipment.filter(e => e.departmentId === dept.id && !e.isActive).length
  }));

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Maintenance performance metrics and insights"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Reports' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Team */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByTeam}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="open" name="Open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requests by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {requestsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Requests by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Equipment Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {requestsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentByDept} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="active" name="Active" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="inactive" name="Inactive" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Type Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Corrective vs Preventive Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              {requestsByType.map((type, index) => (
                <div key={type.name} className="text-center">
                  <div 
                    className="text-5xl font-bold mb-2"
                    style={{ color: index === 0 ? '#ef4444' : '#3b82f6' }}
                  >
                    {type.value}
                  </div>
                  <div className="text-lg text-muted-foreground">{type.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {requests.length > 0 
                      ? `${((type.value / requests.length) * 100).toFixed(1)}% of total`
                      : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
