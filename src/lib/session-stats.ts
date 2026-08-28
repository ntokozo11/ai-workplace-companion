import { useSyncExternalStore } from "react";

export type Activity = { id: string; label: string; detail: string; at: number };

type Stats = {
  tasksPlanned: number;
  highPriority: number;
  researchRequests: number;
  conversations: number;
  activity: Activity[];
};

let state: Stats = {
  tasksPlanned: 0,
  highPriority: 0,
  researchRequests: 0,
  conversations: 0,
  activity: [],
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useSessionStats(): Stats {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

function addActivity(label: string, detail: string) {
  state = {
    ...state,
    activity: [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label, detail, at: Date.now() },
      ...state.activity,
    ].slice(0, 8),
  };
}

export function recordPlan(taskCount: number, highCount: number, detail: string) {
  state = {
    ...state,
    tasksPlanned: state.tasksPlanned + taskCount,
    highPriority: state.highPriority + highCount,
  };
  addActivity("Task plan generated", detail);
  emit();
}

export function recordResearch(detail: string) {
  state = { ...state, researchRequests: state.researchRequests + 1 };
  addActivity("Research completed", detail);
  emit();
}

export function recordChat(detail: string) {
  state = { ...state, conversations: state.conversations + 1 };
  addActivity("AI question answered", detail);
  emit();
}
