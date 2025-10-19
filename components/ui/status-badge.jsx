import React from 'react';
import { Badge } from '@/components/ui/badge';

const getStatusVariant = (status) => {
  const variants = {
    ACTIVE_SCALING: 'success',
    ACTIVE: 'default', 
    INACTIVE: 'destructive',
  };
  return variants[status] || 'secondary';
};

const getStatusLabel = (status) => {
  const labels = {
    ACTIVE_SCALING: 'Ativo e Escalando',
    ACTIVE: 'Ativo',
    INACTIVE: 'Desativado',
  };
  return labels[status] || status;
};

const getStatusColor = (status) => {
  const colors = {
    ACTIVE_SCALING: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
    ACTIVE: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700',
    INACTIVE: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
};

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
