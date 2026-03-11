"""Tests for activity-based stall detection."""

import time
from unittest.mock import patch

from openjarvis.agents._stubs import AgentResult
from openjarvis.agents.executor import AgentExecutor
from openjarvis.agents.manager import AgentManager
from openjarvis.core.events import EventBus, EventType


def test_activity_tracking_updates_last_activity_at(tmp_path):
    """EventBus TOOL_CALL_START updates last_activity_at for the right agent."""
    mgr = AgentManager(str(tmp_path / "test.db"))
    bus = EventBus()
    executor = AgentExecutor(mgr, bus)

    agent = mgr.create_agent("stall-test")

    def fake_invoke(agent_dict):
        bus.publish(EventType.TOOL_CALL_START, {
            "agent": agent_dict["id"],
            "tool": "web_search",
        })
        return AgentResult(content="done", metadata={})

    with patch.object(executor, "_invoke_agent", side_effect=fake_invoke):
        executor.execute_tick(agent["id"])

    updated = mgr.get_agent(agent["id"])
    assert updated["last_activity_at"] is not None
    assert updated["last_activity_at"] > 0
    mgr.close()


def test_activity_tracking_filters_by_agent_id(tmp_path):
    """Events from other agents don't update this agent's last_activity_at."""
    mgr = AgentManager(str(tmp_path / "test.db"))
    bus = EventBus()
    executor = AgentExecutor(mgr, bus)

    agent_a = mgr.create_agent("agent-a")
    agent_b = mgr.create_agent("agent-b")

    def fake_invoke(agent_dict):
        # Emit event for agent_b while agent_a is executing
        bus.publish(EventType.TOOL_CALL_START, {
            "agent": agent_b["id"],
            "tool": "web_search",
        })
        return AgentResult(content="done", metadata={})

    with patch.object(executor, "_invoke_agent", side_effect=fake_invoke):
        executor.execute_tick(agent_a["id"])

    updated_b = mgr.get_agent(agent_b["id"])
    assert updated_b["last_activity_at"] is None
    mgr.close()
