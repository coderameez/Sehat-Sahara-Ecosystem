import { useState } from 'react';
import { Building2, Search, Users, Activity, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { departmentsData } from '../data/demo-data';
import { Button } from '../components/ui/Button';

export function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepartments = departmentsData.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Departments</h1>
          <p className="text-sm text-txt-secondary mt-1">Manage and view hospital departments and their status.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-surface-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
            />
          </div>
          <Button variant="primary">Add Department</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <Card key={dept.id} hover className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-txt-primary">{dept.name}</h3>
                  <p className="text-xs text-txt-secondary">Head: {dept.head}</p>
                </div>
              </div>
              <StatusBadge status={dept.status} dot />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-surface-border">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-txt-secondary">
                  <Users className="h-3.5 w-3.5" />
                  <span>Doctors</span>
                </div>
                <p className="font-semibold text-txt-primary">{dept.doctorsCount}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-txt-secondary">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Today's Load</span>
                </div>
                <p className="font-semibold text-txt-primary">{dept.todayLoad}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-txt-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Timing</span>
                </div>
                <p className="font-semibold text-txt-primary text-sm">{dept.timing}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
