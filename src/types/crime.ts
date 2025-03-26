export interface CrimeReport {
  id: string;
  title: string;
  description: string;
  type: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  reported_by: string;
  reported_at: string;
  images?: string[];
  assigned_to?: string;
}

export interface PatrolMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  officers: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface FIR {
  id: string;
  complainant_name: string;
  complainant_address: string;
  incident_date: string;
  incident_location: string;
  incident_type: string;
  description: string;
  suspects?: string[];
  witnesses?: string[];
  evidence?: string[];
  status: 'draft' | 'filed' | 'investigating' | 'closed';
  filed_by: string;
  filed_at: string;
}

// Mock data for demonstration
export const MOCK_CRIME_DATA = {
  monthly_stats: [
    { month: 'Jan', cases: 65, resolved: 45 },
    { month: 'Feb', cases: 59, resolved: 40 },
    { month: 'Mar', cases: 80, resolved: 65 },
    { month: 'Apr', cases: 81, resolved: 60 },
    { month: 'May', cases: 56, resolved: 45 },
    { month: 'Jun', cases: 55, resolved: 40 },
  ],
  crime_types: [
    { type: 'Theft', count: 150 },
    { type: 'Assault', count: 80 },
    { type: 'Burglary', count: 60 },
    { type: 'Vandalism', count: 40 },
    { type: 'Fraud', count: 30 },
  ],
  hotspots: [
    { id: '1', location: 'Central Market', incidents: 25, lat: 8.7642, lng: 78.1348 },
    { id: '2', location: 'Bus Station', incidents: 18, lat: 8.7539, lng: 78.1354 },
    { id: '3', location: 'Harbor Area', incidents: 15, lat: 8.7519, lng: 78.1694 },
  ],
  recent_reports: [
    {
      id: '1',
      title: 'Shoplifting at Central Market',
      type: 'Theft',
      status: 'investigating',
      severity: 'medium',
      reported_at: '2024-03-15T10:30:00Z',
      location: 'Central Market'
    },
    {
      id: '2',
      title: 'Vehicle Break-in',
      type: 'Burglary',
      status: 'pending',
      severity: 'high',
      reported_at: '2024-03-15T09:15:00Z',
      location: 'Bus Station Parking'
    },
    {
      id: '3',
      title: 'Public Disturbance',
      type: 'Nuisance',
      status: 'resolved',
      severity: 'low',
      reported_at: '2024-03-14T18:45:00Z',
      location: 'Beach Road'
    }
  ]
};