'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TrackingRecord {
  event: string;
  userId: string;
  timestamp: string;
  page: string;
  userAgent: string;
  referrer: string;
  source: string;
  sourceDetails: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ip: string;
  [key: string]: string | undefined;
}

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTrackingData = async () => {
    try {
      const response = await fetch('/api/admin/tracking');
      if (!response.ok) throw new Error('Failed to fetch tracking data');
      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearTrackingData = async () => {
    if (!confirm('Are you sure you want to clear all tracking data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/tracking', {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to clear tracking data');
      
      setTrackingData([]);
      alert('Tracking data cleared successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear tracking data');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  if (loading) return <div className="p-4 text-white">Loading tracking data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Tracking Data</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={clearTrackingData}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Clear All Data
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left text-white">Timestamp</th>
              <th className="px-4 py-2 text-left text-white">Event</th>
              <th className="px-4 py-2 text-left text-white">Page</th>
              <th className="px-4 py-2 text-left text-white">Source</th>
              <th className="px-4 py-2 text-left text-white">User ID</th>
              <th className="px-4 py-2 text-left text-white">Details</th>
            </tr>
          </thead>
          <tbody>
            {trackingData.map((record, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2 text-white">{new Date(record.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-white">{record.event}</td>
                <td className="px-4 py-2 text-white">{record.page}</td>
                <td className="px-4 py-2 text-white">
                  <div className="flex flex-col">
                    <span className="font-semibold">{record.source}</span>
                    {record.sourceDetails && (
                      <span className="text-sm text-gray-300">{record.sourceDetails}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-white">{record.userId}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-gray-800"
                    onClick={() => {
                      const details = { ...record };
                      alert(JSON.stringify(details, null, 2));
                    }}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 