import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Building,
  Activity,
  MoreVertical,
} from 'lucide-react';
import {
  hospitalFacilityStore,
  HospitalFacility,
  FacilityType,
} from '../data/hospitalMockData';

type TypeTab = 'All' | FacilityType;

export const HospitalAccountsList: React.FC = () => {
  const navigate = useNavigate();

  // Subscribe to store
  const [facilities, setFacilities] = useState<HospitalFacility[]>(() =>
    hospitalFacilityStore.getFacilities()
  );

  useEffect(() => {
    const unsub = hospitalFacilityStore.subscribe(() => {
      setFacilities([...hospitalFacilityStore.getFacilities()]);
    });
    return unsub;
  }, []);

  // Filter State
  const [activeTab, setActiveTab] = useState<TypeTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');

  // Expanded row ID for accordion
  const [expandedId, setExpandedId] = useState<string | null>('FAC-001');

  // Filter logic
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchesTab = activeTab === 'All' || fac.type === activeTab;
      const matchesStatus = statusFilter === 'All' || fac.status === statusFilter;
      const matchesCity = cityFilter === 'All' || fac.city === cityFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        fac.name.toLowerCase().includes(q) ||
        fac.city.toLowerCase().includes(q) ||
        fac.primaryContact.name.toLowerCase().includes(q) ||
        fac.primaryContact.phone.toLowerCase().includes(q) ||
        fac.primaryContact.email.toLowerCase().includes(q);

      return matchesTab && matchesStatus && matchesCity && matchesSearch;
    });
  }, [facilities, activeTab, statusFilter, cityFilter, searchQuery]);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hospitalFacilityStore.toggleStatus(id);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── Breadcrumb & Top Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-1">
            <span>Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Hospitals / Clinics</span>
          </div>
          <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
            Hospitals / Clinics
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            Manage registered hospitals, poly-clinics, and basic healthcare facilities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/hospitals/create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hospital / Clinic</span>
          </button>
        </div>
      </div>

      {/* ─── Segmented Pills Tabs (Matching PDF Page 9) ─────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {(['All', 'Basic Clinic', 'Poly-Clinic', 'Hospital'] as TypeTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shrink-0 ${
                isActive
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ─── Search & Filters Bar ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by facility name, city, or contact..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-surface-border bg-surface-page text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-slate-500 shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-[13px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-slate-500 shrink-0">City</label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-[13px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors cursor-pointer"
          >
            <option value="All">All Cities</option>
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Islamabad">Islamabad</option>
          </select>
        </div>

        <button className="h-10 px-3.5 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>More Filters</span>
        </button>
      </div>

      {/* ─── Facilities Table ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-page border-b border-surface-border">
                <th className="w-10 px-3 py-3"></th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Facility</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Primary Contact</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">Doctors</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Created ↓</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredFacilities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400 text-[13px]">
                    No healthcare facilities found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFacilities.map((fac) => {
                  const isExpanded = expandedId === fac.id;

                  return (
                    <React.Fragment key={fac.id}>
                      <tr
                        onClick={() => handleToggleExpand(fac.id)}
                        className={`hover:bg-surface-page/60 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-surface-page/40' : ''
                        }`}
                      >
                        {/* Expand Toggle */}
                        <td className="px-3 py-3.5 text-center text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-brand-700 inline" />
                          ) : (
                            <ChevronDown className="w-4 h-4 inline" />
                          )}
                        </td>

                        {/* Facility Name & Location */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 text-[12px] font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                              {fac.avatarInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-slate-900 truncate">{fac.name}</p>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{fac.city}, {fac.province}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-700">
                            {fac.type === 'Hospital' && <Building className="w-3.5 h-3.5 text-blue-600" />}
                            {fac.type === 'Poly-Clinic' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                            {fac.type === 'Basic Clinic' && <Activity className="w-3.5 h-3.5 text-emerald-600" />}
                            <span>{fac.type}</span>
                          </span>
                        </td>

                        {/* Primary Contact */}
                        <td className="px-4 py-3.5">
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-semibold text-slate-800">{fac.primaryContact.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{fac.primaryContact.phone}</p>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5">
                          <span className="text-[12px] text-slate-600 truncate max-w-[160px] block">
                            {fac.primaryContact.email}
                          </span>
                        </td>

                        {/* Doctors Count */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center font-bold text-[12.5px] text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md min-w-[28px]">
                            {fac.doctorsCount}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {fac.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full leading-none">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full leading-none">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="px-4 py-3.5">
                          <span className="text-[12px] text-slate-600 font-medium">{fac.createdAt}</span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleToggleStatus(fac.id, e)}
                              title={fac.status === 'Active' ? 'Suspend Facility' : 'Activate Facility'}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                                fac.status === 'Active'
                                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {fac.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleToggleExpand(fac.id)}
                              title="Details"
                              className="w-7 h-7 rounded border border-surface-border bg-white flex items-center justify-center text-slate-400 hover:text-slate-700"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Accordion Detail View (Matching PDF Page 9) ── */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-surface-border">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[12px]">
                              {/* Address */}
                              <div className="space-y-1">
                                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" /> Address
                                </span>
                                <p className="text-slate-800 font-medium">{fac.address}</p>
                              </div>

                              {/* Phone & Timings */}
                              <div className="space-y-1">
                                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> Timings & Contact
                                </span>
                                <p className="text-slate-800 font-medium font-mono">{fac.primaryContact.phone}</p>
                                <p className="text-slate-500 text-[11px]">{fac.timings}</p>
                              </div>

                              {/* Services */}
                              <div className="space-y-1">
                                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <Stethoscope className="w-3 h-3 text-slate-400" /> Offered Services
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {fac.services.map((svc, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="inline-block px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10.5px] font-medium"
                                    >
                                      {svc}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Verification status */}
                              <div className="space-y-1">
                                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin Verification
                                </span>
                                <p className="text-emerald-700 font-semibold text-[11.5px]">
                                  Verified facility account
                                </p>
                                {fac.verifiedBy && (
                                  <p className="text-slate-400 text-[11px]">By {fac.verifiedBy}</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Bar ─────────────────────────────────────────── */}
        <div className="px-5 py-3.5 bg-surface-page/50 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">1 to {filteredFacilities.length}</span> of{' '}
            <span className="font-semibold text-slate-900">128</span> facilities
          </div>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[12px]">
              1
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              2
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              13
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Rows per page: 10</span>
          </div>
        </div>
      </div>

    </div>
  );
};
