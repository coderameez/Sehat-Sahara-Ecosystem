import { useState } from 'react';
import { Search, Receipt, Wallet, Banknote, Download } from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { billingStats, billingInvoices } from '../data/demo-data';
import { Button } from '../components/ui/Button';

export function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Today');

  const filteredInvoices = billingInvoices.filter((inv) =>
    inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Billing Overview</h1>
          <p className="text-sm text-txt-secondary mt-1">Manage revenue, payments, and invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button variant="primary">New Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Today's Revenue"
          value={`PKR ${billingStats.todayRevenue.toLocaleString()}`}
          icon={<Wallet className="h-6 w-6" />}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          trend={{ value: '+12% from yesterday', positive: true }}
        />
        <StatCard
          label="Total Paid"
          value={`PKR ${billingStats.totalPaid.toLocaleString()}`}
          icon={<Banknote className="h-6 w-6" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Pending Amount"
          value={`PKR ${billingStats.pendingAmount.toLocaleString()}`}
          icon={<Receipt className="h-6 w-6" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-surface-border px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-txt-primary">Recent Transactions</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-surface-border bg-white px-3 py-2 pr-8 text-sm text-txt-secondary outline-none focus:border-brand-500 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-txt-secondary bg-surface-section border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice Ref</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Payment Method</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-600">{inv.reference}</td>
                  <td className="px-6 py-4 font-medium text-txt-primary">{inv.patient}</td>
                  <td className="px-6 py-4 font-semibold text-txt-primary">{inv.amount}</td>
                  <td className="px-6 py-4 text-txt-secondary">{inv.date}</td>
                  <td className="px-6 py-4 text-txt-secondary">{inv.method}</td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={inv.status} dot />
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-txt-secondary">
                    No transactions found matching "{searchQuery}"
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
