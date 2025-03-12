export const getPriorityClass = (priority: string) => {
    if (!priority) return '';
    switch(priority.toLowerCase()) {
      case 'urgente':
        return 'text-red-600';
      case 'média':
        return 'text-yellow-600';
      case 'baixa':
        return 'text-blue-600';
      default:
        return '';
    }
  };