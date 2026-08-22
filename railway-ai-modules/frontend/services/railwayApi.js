/**
 * railwayApi.js - Frontend API Client Service
 * Connects React/Next.js frontend to the AI Railway Backend API.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const railwayApi = {
  /**
   * Feature 1: Report Track Accident & Broadcast Exact Alerts
   */
  async reportAccident(accidentData) {
    const response = await fetch(`${API_BASE_URL}/accidents/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accidentData)
    });
    if (!response.ok) throw new Error('Failed to report accident');
    return response.json();
  },

  /**
   * Feature 2: AI Scan Planner Mega Block Circular & Blast Personalized Alerts
   */
  async scanMegaBlockCircular(rawText, plannerId = 'PLN_MUMBAI_01') {
    const response = await fetch(`${API_BASE_URL}/megablocks/scan-circular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        raw_circular_text: rawText,
        uploaded_by_planner_id: plannerId
      })
    });
    if (!response.ok) throw new Error('Failed to scan mega block circular');
    return response.json();
  },

  /**
   * Feature 3: Rethink & Calculate AI Alternative Reroutes
   */
  async computeAlternativeRoutes(currentStation, destinationStation, blockedSections = []) {
    const response = await fetch(`${API_BASE_URL}/routes/rethink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_station: currentStation,
        destination_station: destinationStation,
        blocked_sections: blockedSections
      })
    });
    if (!response.ok) throw new Error('Failed to calculate alternative routes');
    return response.json();
  },

  /**
   * Get Passenger Live Status, Targeted Alerts, and Reroutes by PNR
   */
  async getPassengerStatus(pnr) {
    const response = await fetch(`${API_BASE_URL}/passengers/${pnr}/live-status`);
    if (!response.ok) throw new Error(`Failed to fetch status for PNR ${pnr}`);
    return response.json();
  },

  /**
   * Get Full Railway Topology Graph with Live Track Status
   */
  async getNetworkGraph() {
    const response = await fetch(`${API_BASE_URL}/network/graph-status`);
    if (!response.ok) throw new Error('Failed to fetch network graph');
    return response.json();
  }
};

export default railwayApi;
