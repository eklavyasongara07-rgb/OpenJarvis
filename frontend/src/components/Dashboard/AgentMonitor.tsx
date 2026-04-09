import { useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { AgentCard } from './AgentCard';

export function AgentMonitor() {
  const { agentEvents, selectedAgentId, setSelectedAgentId } = useAppStore();

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      // Cleanup handled in store destroy method
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Agent Activity Monitor
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Clear events (optional)
              // useAppStore.getState().clearAgentEvents();
            }}
            className="btn btn-sm btn-outline"
          >
            Clear
          </button>
        </div>
      </div>

      {agentEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No agent activity yet. Start your agents to see real-time monitoring.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {agentEvents.map((event) => (
            <AgentCard
              key={`${event.timestamp}-${event.type}`}
              event={event}
              selected={selectedAgentId === event.data.agentId}
              onSelect={() => setSelectedAgentId(event.data.agentId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}