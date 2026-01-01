
import React, { useState, useEffect } from 'react';
// Added missing Share2 icon to imports
import { Play, Plus, Trash2, Zap, Save, FileCode, CheckCircle2, AlertCircle, Share2 } from 'lucide-react';
import { KernelService } from '../services/KernelService';
import { KernelStatus, KernelSpec } from '../types';

interface Cell {
    id: string;
    type: 'code' | 'markdown';
    content: string;
    output?: any[];
    status?: 'idle' | 'running' | 'success' | 'error';
}

const NotebookView: React.FC = () => {
    const [cells, setCells] = useState<Cell[]>([
        { id: '1', type: 'code', content: 'print("Hello Titan!")\n# Try typing "plot" to see an image.', status: 'idle' }
    ]);
    const [activeKernel, setActiveKernel] = useState<any>(null);
    const [specs, setSpecs] = useState<KernelSpec[]>([]);

    useEffect(() => {
        const setup = async () => {
            const list = await KernelService.KernelSpecManager.listKernelSpecs();
            setSpecs(list);
            const session = await KernelService.KernelManager.startKernel('nb-1', 'user-1', list[0]);
            setActiveKernel(session);
        };
        setup();
    }, []);

    const runCell = async (id: string) => {
        if (!activeKernel) return;

        setCells(prev => prev.map(c => c.id === id ? { ...c, status: 'running' } : c));
        const cell = cells.find(c => c.id === id);
        if (!cell) return;

        try {
            const result = await KernelService.executeInSession(activeKernel.id, cell.content);
            setCells(prev => prev.map(c => c.id === id ? { 
                ...c, 
                status: result.status === 'success' ? 'success' : 'error',
                output: result.outputs
            } : c));
        } catch (e) {
            setCells(prev => prev.map(c => c.id === id ? { ...c, status: 'error' } : c));
        }
    };

    const addCell = (type: 'code' | 'markdown' = 'code') => {
        setCells([...cells, { id: Date.now().toString(), type, content: '', status: 'idle' }]);
    };

    const removeCell = (id: string) => {
        setCells(cells.filter(c => c.id !== id));
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Header / Toolbar */}
            <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-white z-10">
                <div className="flex items-center space-x-4">
                    <h2 className="font-semibold text-gray-700 flex items-center">
                        <FileCode size={18} className="mr-2 text-blue-500" />
                        TitanDiscovery_Core.ipynb
                    </h2>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Zap size={12} className="mr-1 text-yellow-500" />
                        Kernel: {activeKernel?.kernelSpec.displayName}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Save Notebook">
                        <Save size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" title="Share">
                        <Share2 size={18} />
                    </button>
                    <button onClick={() => addCell()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all font-medium shadow-sm">
                        <Plus size={16} className="mr-1" />
                        New Cell
                    </button>
                </div>
            </div>

            {/* Notebook Cells List */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-gray-50/50">
                {cells.map((cell, idx) => (
                    <div key={cell.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        {/* Cell Toolbar (Absolute Right) */}
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-20">
                            <button onClick={() => removeCell(cell.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Line Number / Run Button Gutter */}
                        <div className="flex">
                            <div className="w-12 md:w-16 bg-gray-50 flex flex-col items-center pt-4 border-r border-gray-100">
                                <span className="text-xs text-gray-400 mb-2">[{idx + 1}]</span>
                                <button 
                                    onClick={() => runCell(cell.id)}
                                    disabled={cell.status === 'running'}
                                    className={`
                                        p-2 rounded-full transition-all
                                        ${cell.status === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'hover:bg-blue-100 text-gray-400 hover:text-blue-600'}
                                    `}
                                >
                                    <Play size={18} fill={cell.status === 'running' ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="flex-1">
                                {/* Editor Area */}
                                <textarea 
                                    className="w-full p-4 code-font text-sm focus:outline-none resize-none bg-transparent min-h-[80px]"
                                    value={cell.content}
                                    onChange={(e) => {
                                        const newContent = e.target.value;
                                        setCells(cells.map(c => c.id === cell.id ? { ...c, content: newContent } : c));
                                    }}
                                    placeholder="Write your discovery incantations here..."
                                    rows={Math.max(3, cell.content.split('\n').length)}
                                />

                                {/* Output Area */}
                                {cell.output && cell.output.length > 0 && (
                                    <div className="border-t border-gray-100 bg-gray-50/30 p-4 space-y-3">
                                        {cell.output.map((out, oIdx) => (
                                            <div key={oIdx} className="text-sm">
                                                {out.type === 'stream' && (
                                                    <pre className="text-gray-600 whitespace-pre-wrap">{out.content.text}</pre>
                                                )}
                                                {out.type === 'execute_result' && (
                                                    <div className="bg-white border border-gray-100 p-2 rounded shadow-sm">
                                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Result</span>
                                                        <pre className="text-blue-700 font-medium">{out.content['text/plain']}</pre>
                                                    </div>
                                                )}
                                                {out.type === 'display_data' && out.content['image/png'] && (
                                                    <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden inline-block bg-white shadow-sm">
                                                        <img src={out.content['image/png']} alt="Cell Visualization" className="max-w-full h-auto" />
                                                    </div>
                                                )}
                                                {out.type === 'error' && (
                                                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-700 flex items-start">
                                                        <AlertCircle size={16} className="mr-2 mt-0.5" />
                                                        <div>
                                                            <div className="font-bold">{out.content.name}</div>
                                                            <div className="text-xs mt-1">{out.content.message}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cell Status Bar */}
                        <div className="h-1 flex">
                            {cell.status === 'success' && <div className="flex-1 bg-green-500"></div>}
                            {cell.status === 'error' && <div className="flex-1 bg-red-500"></div>}
                            {cell.status === 'running' && <div className="flex-1 bg-blue-500"></div>}
                        </div>
                    </div>
                ))}

                {/* Bottom spacer / Add button */}
                <div className="flex justify-center pb-20">
                    <button onClick={() => addCell()} className="group flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                        <Plus size={20} className="mr-2" />
                        <span className="font-medium">Append Discovery Logic</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotebookView;
