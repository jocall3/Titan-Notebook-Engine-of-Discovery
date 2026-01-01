
import React, { useState, useEffect, useRef } from 'react';
import { 
    GitBranch, 
    Play, 
    Save, 
    Trash2, 
    Layout, 
    Maximize,
    ChevronRight,
    Search,
    Database,
    Zap,
    // Added missing Activity icon to imports
    Activity
} from 'lucide-react';
import { KernelService } from '../services/KernelService';

const WorkflowDesigner: React.FC = () => {
    const [vizData, setVizData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await KernelService.WorkflowEngine.getGraphVisualization('graph-1');
            setVizData(data);
            setIsLoading(false);
        };
        load();
    }, []);

    return (
        <div className="flex-1 flex overflow-hidden bg-white">
            {/* Component Palette (Left Sidebar) */}
            <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search blocks..." className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ingress & Sources</h4>
                        <div className="space-y-2">
                            <DraggableItem icon={<Database size={16} className="text-blue-500" />} label="Postgres Query" />
                            <DraggableItem icon={<Database size={16} className="text-green-500" />} label="CSV Ingest" />
                            <DraggableItem icon={<Zap size={16} className="text-yellow-500" />} label="Stream Reader" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Compute Modules</h4>
                        <div className="space-y-2">
                            <DraggableItem icon={<Layout size={16} className="text-purple-500" />} label="Python Script" />
                            <DraggableItem icon={<Layout size={16} className="text-indigo-500" />} label="AI Classifier" />
                            <DraggableItem icon={<Layout size={16} className="text-pink-500" />} label="Feature Scale" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Design Canvas */}
            <div className="flex-1 relative bg-gray-50 flex flex-col">
                {/* Canvas Toolbar */}
                <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 justify-between shadow-sm z-10">
                    <div className="flex items-center space-x-3">
                        <GitBranch size={20} className="text-purple-600" />
                        <span className="font-bold">Discovery_Workflow_v2</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                            <Save size={16} className="mr-2" />
                            Draft
                        </button>
                        <button className="flex items-center px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm">
                            <Play size={16} className="mr-2" />
                            Orchestrate
                        </button>
                    </div>
                </div>

                {/* The Graph Canvas (Mocked Visualization) */}
                <div className="flex-1 overflow-auto p-12 relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    
                    {isLoading ? (
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-12">
                            {vizData.nodes.map((node: any, idx: number) => (
                                <React.Fragment key={node.id}>
                                    <div className={`
                                        w-48 p-4 bg-white border-2 rounded-2xl shadow-sm relative group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg
                                        ${node.status === 'running' ? 'border-blue-500 ring-4 ring-blue-500/10' : 
                                          node.status === 'completed' ? 'border-green-500' : 'border-gray-200'}
                                    `}>
                                        <div className="flex items-center mb-2">
                                            <div className={`p-1.5 rounded-lg mr-2 ${
                                                node.type === 'data_source' ? 'bg-blue-50 text-blue-600' :
                                                node.type === 'model_training' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'
                                            }`}>
                                                {node.type === 'data_source' ? <Database size={14} /> : <Zap size={14} />}
                                            </div>
                                            <span className="text-xs font-bold text-gray-800 truncate">{node.label}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase">{node.status}</div>
                                        
                                        {/* Execution status indicator */}
                                        <div className="absolute -top-2 -right-2">
                                            {node.status === 'completed' && <div className="bg-green-500 text-white rounded-full p-0.5"><ChevronRight size={10} /></div>}
                                            {node.status === 'running' && <div className="bg-blue-500 w-3 h-3 rounded-full animate-ping"></div>}
                                        </div>
                                    </div>
                                    {idx < vizData.nodes.length - 1 && (
                                        <div className="flex-shrink-0 w-12 h-0.5 bg-gray-200 relative">
                                            <div className="absolute -right-1 -top-1 border-t-4 border-b-4 border-l-8 border-transparent border-l-gray-200"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Stats / Logs Overlay */}
                <div className="absolute bottom-6 left-6 right-6 h-32 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-4 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                            <Activity size={12} className="mr-1" />
                            Workflow Execution Logs
                        </span>
                        <div className="text-xs font-mono text-gray-400">Step: 2/4 - features.clean()</div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-black rounded-lg p-3 font-mono text-[11px] text-green-400/90 leading-relaxed">
                        <div className="opacity-50">[2023-11-20 14:02:11] INITIALIZING DAG ORCHESTRATOR</div>
                        <div>[2023-11-20 14:02:12] NODE_EXTRACT: COMPLETED [ROW_COUNT: 45,210]</div>
                        <div className="text-blue-400 animate-pulse">[2023-11-20 14:02:14] NODE_CLEAN: RUNNING FEATURE ENGINEERING KERNEL...</div>
                        <div className="opacity-50">[2023-11-20 14:02:15] WARN: COLUMN 'NULL_VALS' EXCEEDS THRESHOLD. AUTO-FILLING.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DraggableItem: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group">
        <div className="mr-3">{icon}</div>
        <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize size={12} className="text-gray-300" />
        </div>
    </div>
);

export default WorkflowDesigner;
