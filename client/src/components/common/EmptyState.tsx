import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function EmptyState({ icon, title, description, action, variant = 'default' }: EmptyStateProps) {
  const defaultIcons = {
    default: <Info className="h-12 w-12" />,
    success: <CheckCircle className="h-12 w-12" />,
    warning: <AlertCircle className="h-12 w-12" />,
    error: <XCircle className="h-12 w-12" />
  };

  const iconColors = {
    default: 'text-muted-foreground',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-destructive'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={cn('mb-4', iconColors[variant])}>
        {icon || defaultIcons[variant]}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
