import { useState, useSyncExternalStore } from 'react';
import { Calendar, Clock, Filter, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { store } from '../store';
import { ScheduleModal } from '../components/schedule/ScheduleModal';
import { Button } from '../components/ui/Button';

export function SchedulePage() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSchedule = state.schedules.filter((sch) => {
    const facilityMatch = sch.facilityId === state.session.activeFacilityId;
    const branchMatch = state.session.facilityType === 'HOSPITAL' 
      ? sch.branchId === state.session.activeBranchId 
      : true;
    const dayMatch = sch.dayOfWeek === selectedDay;
    return facilityMatch && branchMatch && dayMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Doctor Schedule</h1>
          <p className="text-sm text-txt-secondary mt-1">Manage weekly rosters and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add Schedule</Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border border-surface-border rounded-xl p-2 shadow-sm overflow-x-auto">
        <Button variant="ghost" size="sm" icon={<ChevronLeft className="h-4 w-4" />} onClick={() => setSelectedDay(days[(days.indexOf(selectedDay) - 1 + 7) % 7])} />
        <div className="flex items-center gap-2 px-4 min-w-max">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedDay === day
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-txt-secondary hover:bg-slate-50 hover:text-txt-primary'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" icon={<ChevronRight className="h-4 w-4" />} onClick={() => setSelectedDay(days[(days.indexOf(selectedDay) + 1) % 7])} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedule.map((sch) => (
          <Card key={sch.id} hover className="flex flex-col border-l-4 border-l-brand-500">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-txt-primary">{sch.providerName}</h3>
                  <p className="text-xs text-txt-secondary">{sch.specialty}</p>
                </div>
              </div>
              <StatusBadge status={sch.status} dot />
            </div>
            
            <div className="mt-auto pt-4 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-txt-primary">{sch.startTime} - {sch.endTime}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                  {sch.slotDurationMinutes} min slots
                </span>
              </div>
            </div>
          </Card>
        ))}
        {filteredSchedule.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-txt-primary">No Schedules Found</h3>
            <p className="text-txt-secondary mt-1">There are no doctors scheduled for {selectedDay}.</p>
          </div>
        )}
      </div>

      <ScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
