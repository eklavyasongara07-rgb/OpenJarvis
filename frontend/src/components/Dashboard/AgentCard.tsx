interface AgentCardProps {
  event: {
    type: string;
    timestamp: number;
    data: Record<string, unknown>;
  };
  selected: boolean;
  onSelect: () => void;
}

export function AgentCard({ event, selected, onSelect }: AgentCardProps) {
  // Simple time ago calculation
  const timeAgo = (() => {
    const seconds = Math.floor((Date.now() - event.timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  })();
  
  // Determine icon and color based on event type
  const getEventDetails = (type: string) => {
    switch (type) {
      case 'prospecting_start':
        return { icon: '🔍', color: 'text-blue-500' };
      case 'prospecting_complete':
        return { icon: '✅', color: 'text-green-500' };
      case 'lead_scraped':
        return { icon: '👤', color: 'text-purple-500' };
      case 'lead_qualified':
        return { icon: '🎯', color: 'text-orange-500' };
      case 'dm_generated':
        return { icon: '💬', color: 'text-indigo-500' };
      case 'follow_up_scheduled':
        return { icon: '⏰', color: 'text-yellow-500' };
      case 'error':
        return { icon: '⚠️', color: 'text-red-500' };
      default:
        return { icon: '📊', color: 'text-muted-foreground' };
    }
  };

  const { icon, color } = getEventDetails(event.type);

  return (
    <div
      className={`p-4 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors ${
        selected ? 'border-accent bg-accent/20' : 'border-border'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className={`h-8 w-8 flex items-center justify-center ${color} rounded`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between">
            <h3 className="font-medium">{event.type.replace(/_/g, ' ')}</h3>
            <time className="text-xs text-muted-foreground">{timeAgo}</time>
          </div>
          <div className="text-sm text-muted-foreground">
            {JSON.stringify(event.data).length > 100 
              ? JSON.stringify(event.data).substring(0, 100) + '...'
              : JSON.stringify(event.data)}
          </div>
        </div>
      </div>
    </div>
  );
}