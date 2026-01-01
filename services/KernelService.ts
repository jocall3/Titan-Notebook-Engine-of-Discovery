
import { UUID, KernelEnvironmentType, KernelStatus, OutputMessage, KernelSpec, ExecutionResult } from '../types';

export const KernelSpecManager = {
    availableSpecs: {
        python3: {
            name: 'python3',
            displayName: 'Python 3 (Global)',
            language: 'python',
            environmentType: KernelEnvironmentType.Python3,
            argv: ['python', '-m', 'ipykernel_launcher'],
            resources: { cpuCores: 2, memoryGB: 4 },
            supportsDebugging: true,
            supportsInterrupt: true,
            richOutputMimeTypes: ['text/plain', 'text/html', 'image/png'],
            description: 'Standard Python 3 kernel for data science.',
            tags: ['python', 'ml'],
            version: '3.9.7'
        },
        sql: {
            name: 'sql',
            displayName: 'PostgreSQL (Main)',
            language: 'sql',
            environmentType: KernelEnvironmentType.SQL,
            argv: [],
            resources: { cpuCores: 1, memoryGB: 2 },
            supportsDebugging: false,
            supportsInterrupt: true,
            richOutputMimeTypes: ['text/plain', 'text/html', 'application/json'],
            description: 'SQL kernel for local and remote DB queries.',
            tags: ['sql', 'database'],
            version: '13.0'
        }
    } as Record<string, KernelSpec>,

    listKernelSpecs: async () => Object.values(KernelSpecManager.availableSpecs)
};

export const KernelManager = {
    _activeSessions: new Map<UUID, any>(),

    startKernel: async (notebookId: UUID, userId: UUID, kernelSpec: KernelSpec): Promise<any> => {
        const sessionId = `ksess-${Date.now()}`;
        const session = {
            id: sessionId,
            notebookId,
            userId,
            environment: kernelSpec.environmentType,
            status: KernelStatus.Idle,
            connectedClients: [userId],
            startTime: new Date(),
            lastActivity: new Date(),
            kernelSpec,
            resourceUsage: { cpuPercent: 0, memoryBytes: 256 * 1024 * 1024 }
        };
        KernelManager._activeSessions.set(sessionId, session);
        return session;
    },

    getKernelSession: async (sessionId: UUID) => KernelManager._activeSessions.get(sessionId),
    
    listKernelSessions: async () => Array.from(KernelManager._activeSessions.values())
};

export const AICodeCompanion = {
    requestAssistance: async (request: any): Promise<any> => {
        await new Promise(r => setTimeout(r, 1500));
        return {
            suggestedCode: request.type === 'generate_code' 
                ? "import pandas as pd\ndf = pd.read_csv('data.csv')\ndf.describe()" 
                : "# AI Insight\n# Correlation detected between columns A and B.",
            explanation: "I've generated a snippet to help with your data analysis."
        };
    }
};

export const TelemetryService = {
    _eventLog: [] as any[],
    emitEvent: (event: any) => {
        TelemetryService._eventLog.push({ ...event, timestamp: new Date() });
    },
    getRecentEvents: async () => TelemetryService._eventLog.slice(-50)
};

export const WorkflowEngine = {
    _graphs: new Map<UUID, any>(),
    defineGraph: async (graph: any, userId: UUID) => {
        const id = `graph-${Date.now()}`;
        WorkflowEngine._graphs.set(id, { ...graph, id });
        return id;
    },
    getGraphVisualization: async (graphId: UUID) => {
        // Mock DAG structure
        return {
            nodes: [
                { id: 'n1', label: 'Extract Data', type: 'data_source', status: 'completed' },
                { id: 'n2', label: 'Clean Features', type: 'code_cell', status: 'running' },
                { id: 'n3', label: 'Train Model', type: 'model_training', status: 'pending' },
                { id: 'n4', label: 'Export Results', type: 'decision_point', status: 'pending' }
            ],
            edges: [
                { source: 'n1', target: 'n2' },
                { source: 'n2', target: 'n3' },
                { source: 'n3', target: 'n4' }
            ]
        };
    }
};

export const KernelService = {
    initializeUniverse: async () => {
        console.log("Kernel Universe Initialized");
    },
    executeInSession: async (sessionId: UUID, code: string, options?: any): Promise<ExecutionResult> => {
        const session = await KernelManager.getKernelSession(sessionId);
        session.status = KernelStatus.Busy;
        
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        
        const outputs: OutputMessage[] = [
            { type: 'stream', content: { text: "Executing Titan command...\n" }, timestamp: new Date() }
        ];

        if (code.toLowerCase().includes('plot')) {
            outputs.push({ 
                type: 'display_data', 
                content: { 'image/png': 'https://picsum.photos/400/300' }, 
                timestamp: new Date() 
            });
        }

        outputs.push({ 
            type: 'execute_result', 
            content: { 'text/plain': `Titan Result: ${code.length * 42}` }, 
            timestamp: new Date() 
        });

        session.status = KernelStatus.Idle;
        return {
            executionId: `exec-${Date.now()}`,
            status: 'success',
            outputs,
            durationMs: 1200,
            stdout: "Titan Engine active.\nTask completed.",
            metrics: { cpuTimeMs: 150, memoryPeakMB: 240 }
        };
    },
    KernelManager,
    KernelSpecManager,
    AICodeCompanion,
    TelemetryService,
    WorkflowEngine
};
