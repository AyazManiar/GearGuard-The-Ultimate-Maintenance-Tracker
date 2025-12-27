import React from 'react';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high: { label: 'High', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  medium: { label: 'Medium', className: 'bg-primary/10 text-primary border-primary/20' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-border' }
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || { label: priority, className: 'bg-muted text-muted-foreground' };
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
