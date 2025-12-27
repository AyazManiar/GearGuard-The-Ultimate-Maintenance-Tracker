import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID (simple UUID-like)
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date for display
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format date for input fields
export function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Check if date is overdue
export function isOverdue(date: Date | string | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

// Calculate duration in hours between two dates
export function calculateDuration(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
}

// Get status color class
export function getStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-blue-500';
    case 'in_progress': return 'bg-amber-500';
    case 'repaired': return 'bg-emerald-500';
    case 'scrap': return 'bg-destructive';
    default: return 'bg-muted';
  }
}

// Get priority color class
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-destructive';
    case 'high': return 'text-amber-600';
    case 'medium': return 'text-primary';
    case 'low': return 'text-muted-foreground';
    default: return 'text-foreground';
  }
}

// Get category icon name
export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'machine': return 'Cog';
    case 'vehicle': return 'Car';
    case 'computer': return 'Monitor';
    default: return 'Package';
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate serial number (alphanumeric with dashes)
export function isValidSerialNumber(serial: string): boolean {
  const serialRegex = /^[A-Za-z0-9-]+$/;
  return serial.length >= 3 && serialRegex.test(serial);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
