import { useState } from 'react';
import { Search, HeartPulse, Building2, CreditCard } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { servicesData } from '../data/demo-data';
import { Button } from '../components/ui/Button';

export function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = servicesData.filter((srv) =>
    srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    srv.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Services</h1>
          <p className="text-sm text-txt-secondary mt-1">Overview of hospital services, availability, and indicative fees.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-surface-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
            />
          </div>
          <Button variant="primary">Add Service</Button>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-txt-secondary bg-surface-section border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Service Name</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Availability</th>
                <th className="px-6 py-4 font-semibold">Fee / Range</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <HeartPulse className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-txt-primary">{srv.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-txt-secondary">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{srv.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-txt-secondary">
                    {srv.availability}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-txt-primary font-medium">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      <span>{srv.fee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={srv.status} dot />
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-txt-secondary">
                    No services found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
