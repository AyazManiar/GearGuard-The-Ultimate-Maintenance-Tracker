import React from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TeamsPage() {
  const { getAllTeamsWithRelations } = useApp();
  const teams = getAllTeamsWithRelations();

  return (
    <div>
      <PageHeader
        title="Maintenance Teams"
        description="Manage specialized maintenance teams"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Teams' }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {team.members?.length || 0} members
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{team.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                {team.members?.slice(0, 4).map(member => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{team.equipmentCount} equipment</span>
                <span className={team.openRequestCount && team.openRequestCount > 0 ? 'text-amber-600' : 'text-muted-foreground'}>
                  {team.openRequestCount} open requests
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
