import { formatDistanceToNow } from 'date-fns';

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
  const timeAgo = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true });
  
  // Determine icon and color based on event type
  const getEventDetails = (type: string) => {
    switch (type) {
      case 'prospecting_start':
        return { icon: 'Search', color: 'text-blue-500' };
      case 'prospecting_complete':
        return { icon: 'CheckCircle2', color: 'text-green-500' };
      case 'lead_scraped':
        return { icon: 'UserPlus', color: 'text-purple-500' };
      case 'lead_qualified':
        return { icon: 'Target', color: 'text-orange-500' };
      case 'dm_generated':
        return { icon: 'MessageCircle', color: 'text-indigo-500' };
      case 'follow_up_scheduled':
        return { icon: 'Clock', color: 'text-yellow-500' };
      case 'error':
        return { icon: 'AlertTriangle', color: 'text-red-500' };
      default:
        return { icon: 'Activity', color: 'text-muted-foreground' };
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
          {/* Using Lucide icons - you'll need to import them */}
          <span className="text-sm">{icon}</span>
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