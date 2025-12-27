import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  repaired: { label: 'Repaired', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  scrap: { label: 'Scrapped', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  
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
