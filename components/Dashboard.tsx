
import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
    Activity, 
    Cpu, 
    HardDrive, 
    Network, 
    RefreshCcw, 
    Power, 
    ShieldAlert, 
    Search
} from 'lucide-react';
import { KernelService } from '../services/KernelService';

const Dashboard: React.FC = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [telemetry, setTelemetry] = useState<any[]>([]);
    const [mockResourceData, setMockResourceData] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const list = await KernelService.KernelManager.listKernelSessions();
            setSessions(list);
            const tele = await KernelService.TelemetryService.getRecentEvents();
            setTelemetry(tele);
        };
        fetch();

        // Simulate resource usage metrics over time
        const interval = setInterval(() => {
            setMockResourceData(prev => {
                const newData = [...prev, {
                    time: new Date().toLocaleTimeString(),
                    cpu: Math.floor(Math.random() * 40) + 10,
                    memory: Math.floor(Math.random() * 20) + 60
                }].slice(-20);
                return newData;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kernel Monitor</h1>
                    <p className="text-gray-500 mt-1">Real-time telemetry and resource orchestration.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <RefreshCcw size={16} className="mr-2" />
                        Refresh State
                    </button>
                    <button className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100">
                        <Power size={16} className="mr-2" />
                        Shutdown Global
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Cpu className="text-blue-500" />} label="Active Sessions" value={sessions.length.toString()} trend="+1 since last hour" />
                <StatCard icon={<HardDrive className="text-green-500" />} label="Memory Footprint" value="4.2 GB" trend="64% Utilized" />
                <StatCard icon={<Activity className="text-purple-500" />} label="Total Computations" value="1,294" trend="15 / minute" />
                <StatCard icon={<ShieldAlert className="text-red-500" />} label="Security Blocker" value="0" trend="Active Sandbox" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Metrics Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Resource Utilization (Aggregate)</h3>
                        <div className="flex space-x-4 text-xs font-medium">
                            <span className="flex items-center text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> CPU %</span>
                            <span className="flex items-center text-green-500"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Memory %</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockResourceData}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                                <Area type="monotone" dataKey="memory" stroke="#22c55e" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Session Table */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Active Sessions</h3>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {sessions.length > 0 ? sessions.map(s => (
                            <div key={s.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:bg-gray-100 transition-colors">
                                <div>
                                    <div className="font-semibold text-sm truncate max-w-[120px]">{s.id}</div>
                                    <div className="text-xs text-gray-500 uppercase">{s.kernelSpec.displayName}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                        {s.status}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1">Uptime: 14m 2s</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-10 text-sm">No active sessions found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Log / Telemetry */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold">System Telemetry</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Filter events..." className="w-full pl-10 pr-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Timestamp</th>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Details</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {telemetry.length > 0 ? telemetry.map((t, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{t.timestamp.toLocaleTimeString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            t.type === 'error' ? 'bg-red-100 text-red-600' : 
                                            t.type === 'security_alert' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 truncate max-w-xs">{JSON.stringify(t.data)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-xs text-green-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                            Logged
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No recent telemetry events captured.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string }> = ({ icon, label, value, trend }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{trend}</div>
    </div>
);

export default Dashboard;
