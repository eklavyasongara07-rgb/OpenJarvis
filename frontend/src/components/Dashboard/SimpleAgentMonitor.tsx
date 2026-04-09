import { useEffect, useState } from 'react';

interface AgentActivity {
  timestamp: string;
  agentType: string;
  eventType: string;
  data: Record<string, unknown>;
}

export function SimpleAgentMonitor() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load activities from file system
    const loadActivities = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate by checking if we can access the monitor directory
        // Since we can't directly access filesystem from browser for security,
        // we'll create a simple mock that shows the concept
        
        setLoading(false);
        
        // For demo purposes, show some sample activities
        // In production, this would be replaced with actual file reading via backend API
        const mockActivities: AgentActivity[] = [
          {
            timestamp: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
            agentType: 'prospecting-automation',
            eventType: 'prospecting_start',
            data: { message: 'Lead prospecting started' }
          },
          {
            timestamp: new Date(Date.now() - 25000).toISOString(), // 25 seconds ago
            agentType: 'prospecting-automation',
            eventType: 'profiles_scraped',
            data: { count: 150, filteredCount: 45, message: 'Scraped 150 profiles, 45 after filtering' }
          },
          {
            timestamp: new Date(Date.now() - 20000).toISOString(), // 20 seconds ago
            agentType: 'prospecting-automation',
            eventType: 'leads_qualified',
            data: { count: 12, message: '12 leads qualified' }
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error('Failed to load agent activities:', error);
        setLoading(false);
      }
    };

    loadActivities();
    
    // Set up polling to check for new activities
    const interval = setInterval(loadActivities, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading agent activities...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No agent activity yet. Start your agents to see real-time monitoring.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Make sure your agents are running and logging activities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Live Agent Activity Monitor
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-muted-foreground">Live updates</span>
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={`${activity.timestamp}-${index}`} className="p-4 border rounded-lg border-b-2 border-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 flex items-center justify-center bg-blue-500/10 rounded">
                {/* Agent type icon */}
                {activity.agentType === 'prospecting-automation' && '🔍'}
                {activity.agentType === 'follow-up-tracker' && '📧'}
                {activity.agentType === 'audit-generator' && '📋'}
                {/* Default icon */}
                {!['prospecting-automation', 'follow-up-tracker', 'audit-generator'].includes(activity.agentType) && '🤖'}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-sm">
                    {activity.eventType.replace(/_/g, ' ')}
                  </h3>
                  <time className="text-xs text-muted-foreground">
                    {() => {
                      const seconds = Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / 1000);
                      if (seconds < 60) return `${seconds}s ago`;
                      const minutes = Math.floor(seconds / 60);
                      if (minutes < 60) return `${minutes}m ago`;
                      const hours = Math.floor(minutes / 60);
                      return `${hours}h ago`;
                    }}()
                  </time>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.data.message || JSON.stringify(activity.data)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}