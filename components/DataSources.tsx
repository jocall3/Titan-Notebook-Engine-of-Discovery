
import React from 'react';
import { Database, Cloud, FileText, Search, Plus, Filter, MoreVertical, CheckCircle2 } from 'lucide-react';

const DataSources: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Data Catalog</h1>
                    <p className="text-gray-500 mt-1">Managed assets and external ingestion endpoints.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md">
                    <Plus size={18} className="mr-2" />
                    Connect Source
                </button>
            </header>

            <div className="mb-6 flex space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search tables, buckets, or APIs..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                </div>
                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm">
                    <Filter size={18} className="mr-2" />
                    Filter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DataCard 
                    title="Production PostgreSQL" 
                    type="database" 
                    icon={<Database className="text-blue-500" />} 
                    host="10.0.42.11" 
                    status="Healthy" 
                    tables={124} 
                />
                <DataCard 
                    title="Discovery Bucket (GCS)" 
                    type="cloud_storage" 
                    icon={<Cloud className="text-green-500" />} 
                    host="gs://titan-assets-bucket" 
                    status="Healthy" 
                    tables={842} 
                />
                <DataCard 
                    title="Weather API Endpoint" 
                    type="api" 
                    icon={<FileText className="text-yellow-500" />} 
                    host="https://api.weather.discovery" 
                    status="Healthy" 
                    tables={12} 
                />
                <DataCard 
                    title="User Logs Parquet" 
                    type="dataset" 
                    icon={<FileText className="text-purple-500" />} 
                    host="/datasets/logs/daily" 
                    status="Offline" 
                    tables={1} 
                />
            </div>
        </div>
    );
};

const DataCard: React.FC<{ title: string, type: string, icon: React.ReactNode, host: string, status: string, tables: number }> = ({ title, type, icon, host, status, tables }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">{icon}</div>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
        <p className="text-xs text-gray-500 font-mono mb-4 truncate">{host}</p>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center space-x-4">
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Status</div>
                    <div className={`text-sm font-bold mt-1 ${status === 'Healthy' ? 'text-green-600' : 'text-red-500'}`}>{status}</div>
                </div>
                <div className="text-center border-l border-gray-100 pl-4">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Assets</div>
                    <div className="text-sm font-bold mt-1 text-gray-800">{tables}</div>
                </div>
            </div>
            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                <CheckCircle2 size={20} />
            </button>
        </div>
    </div>
);

export default DataSources;
