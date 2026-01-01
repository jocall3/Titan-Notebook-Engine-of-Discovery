
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { 
    Layout, 
    Terminal, 
    Cpu, 
    BrainCircuit, 
    Database, 
    Settings, 
    Share2, 
    Plus,
    Activity,
    GitBranch
} from 'lucide-react';
import { KernelService } from './services/KernelService';

import NotebookView from './components/NotebookView';
import Dashboard from './components/Dashboard';
import WorkflowDesigner from './components/WorkflowDesigner';
import DataSources from './components/DataSources';

const App: React.FC = () => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            await KernelService.initializeUniverse();
            setInitialized(true);
        };
        init();
    }, []);

    if (!initialized) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h1 className="text-xl font-bold text-gray-700">Waking the Titan Engine...</h1>
                <p className="text-gray-500 mt-2">Initializing Discovery Universe</p>
            </div>
        );
    }

    return (
        <HashRouter>
            <div className="flex h-screen w-screen overflow-hidden text-gray-900 bg-white">
                {/* Sidebar */}
                <aside className="w-16 md:w-64 border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300">
                    <div className="h-16 flex items-center px-4 border-b border-gray-200">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Cpu size={24} />
                        </div>
                        <span className="ml-3 font-bold text-lg hidden md:block">Titan Discovery</span>
                    </div>

                    <nav className="flex-1 py-4 overflow-y-auto">
                        <NavItem to="/" icon={<Terminal size={20} />} label="Notebooks" />
                        <NavItem to="/dashboard" icon={<Activity size={20} />} label="Kernel Monitor" />
                        <NavItem to="/workflows" icon={<GitBranch size={20} />} label="Workflows" />
                        <NavItem to="/data" icon={<Database size={20} />} label="Data Catalog" />
                        <div className="my-4 border-t border-gray-200 md:mx-4"></div>
                        <NavItem to="/ai" icon={<BrainCircuit size={20} />} label="AI Assistant" />
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<NotebookView />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workflows" element={<WorkflowDesigner />} />
                        <Route path="/data" element={<DataSources />} />
                        <Route path="/ai" element={<div className="p-8 text-center"><BrainCircuit className="mx-auto text-blue-300" size={64} /><h2 className="mt-4 text-2xl font-bold">Titan Intelligence Interface</h2><p className="text-gray-500">Autonomous co-pilot module active.</p></div>} />
                        <Route path="/settings" element={<div className="p-8">Settings Page</div>} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `
            flex items-center px-4 py-3 transition-colors
            ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}
        `}
    >
        {icon}
        <span className="ml-3 hidden md:block truncate">{label}</span>
    </NavLink>
);

export default App;
