import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { History, ShieldCheck, Search, Filter } from 'lucide-react';

export const AdminAuditLogsView: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/admin/audit-logs?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setLogs(data.logs || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  const filtered = logs.filter((l) => {
    return (
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
      (l.user_name && l.user_name.toLowerCase().includes(search.toLowerCase())) ||
      (l.ip_address && l.ip_address.includes(search))
    );
  });

  return (
    <DashboardLayout
      title="Jejak Audit Keamanan Sistem (Audit Trail)"
      subtitle="Perekaman kronologis setiap aktivitas login, perubahan naskah, keputusan dewan redaksi, dan manipulasi data."
    >
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tindakan aksi, aktor, atau alamat IP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-5">Waktu (WIB)</th>
                <th className="py-3.5 px-4">Tindakan / Aksi</th>
                <th className="py-3.5 px-4">Aktor Pengguna</th>
                <th className="py-3.5 px-4">Entitas</th>
                <th className="py-3.5 px-4">Rincian Perubahan</th>
                <th className="py-3.5 px-5 font-mono text-right">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Memuat catatan log audit...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada catatan audit yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{log.user_name || 'System'}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{log.user_role || '-'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{log.entity_type}</td>
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-md">{log.details}</td>
                    <td className="py-3.5 px-5 font-mono text-slate-400 text-right whitespace-nowrap">
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
