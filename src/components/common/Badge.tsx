import React from 'react';

type BadgeVariant =
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'suspended'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'credit'
  | 'paymob'
  | 'visible'
  | 'hidden'
  | 'neutral'
  | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    completed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
    cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
    active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    suspended: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    pending: 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/20',
    approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
    credit: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
    paymob: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
    visible: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    hidden: 'bg-slate-100 text-slate-700 ring-1 ring-slate-500/20',
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-slate-500/20',
    primary: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
