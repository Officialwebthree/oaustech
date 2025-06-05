import React from 'react';
import { History } from 'lucide-react';
import { format } from 'date-fns';
import CardLayout from './CardLayout';
import { useWaterQuality } from '../../context/WaterQualityContext';

const HistoricalRecords: React.FC = () => {
  const { historicalData } = useWaterQuality();

  return (
    <CardLayout
      title="Historical Records"
      icon={<History className="h-5 w-5 text-amber-500" />}
      infoText="Past 7 days of water quality measurements"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Temperature</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">pH</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Turbidity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salinity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {historicalData.map((record, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-900">
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {record.temperature.toFixed(1)}°C
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {record.ph.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {record.turbidity.toFixed(2)} ppm
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {record.salinity.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'Optimal' ? 'bg-green-100 text-green-800' :
                    record.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardLayout>
  );
};

export default HistoricalRecords;