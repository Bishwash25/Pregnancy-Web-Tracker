import {
  DashboardSnapshot,
  getDashboardSnapshotForWeek,
} from "@/data/pregnancyDashboardData";

// Simple internal API wrapper for the pregnancy dashboard.
// If you ever move this to a real HTTP API, keep this function
// signature the same and change only the implementation.

export async function fetchDashboardSnapshot(
  week: number
): Promise<DashboardSnapshot> {
  // Currently this is a pure in-app "API" – no network call.
  // It stays fast in the browser and is easy to swap later.
  return getDashboardSnapshotForWeek(week);
}


