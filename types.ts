
export type UUID = string;

export enum KernelEnvironmentType {
    Python3 = 'python3',
    R = 'r',
    Julia = 'julia',
    NodeJS = 'nodejs',
    Go = 'go',
    Java = 'java',
    SQL = 'sql',
    Bash = 'bash',
    AIModel = 'aimodel',
    Custom = 'custom',
    Quantum = 'quantum',
    GPUCompute = 'gpucompute',
    TPUCompute = 'tpucompute',
    WebAssembly = 'wasm',
}

export enum KernelStatus {
    Starting = 'starting',
    Running = 'running',
    Idle = 'idle',
    Busy = 'busy',
    Restarting = 'restarting',
    ShuttingDown = 'shutting_down',
    Dead = 'dead',
    Error = 'error',
    Provisioning = 'provisioning',
    Decommissioning = 'decommissioning',
}

export interface OutputMessage {
    type: 'stream' | 'display_data' | 'execute_result' | 'error' | 'status' | 'clear_output' | 'update_display_data' | 'log' | 'metric' | 'trace';
    content: any;
    metadata?: Record<string, any>;
    timestamp: Date;
    cellId?: UUID;
    outputId?: UUID;
    parentId?: UUID;
}

export interface KernelSpec {
    name: string;
    displayName: string;
    language: string;
    environmentType: KernelEnvironmentType;
    argv: string[];
    resources: {
        cpuCores?: number;
        memoryGB?: number;
        gpuCount?: number;
        tpuCount?: number;
    };
    supportsDebugging: boolean;
    supportsInterrupt: boolean;
    richOutputMimeTypes: string[];
    description?: string;
    tags?: string[];
    version?: string;
}

export interface ExecutionResult {
    executionId: UUID;
    status: 'success' | 'error' | 'timeout' | 'interrupted' | 'cancelled' | 'pending' | 'running';
    outputs: OutputMessage[];
    durationMs: number;
    stdout?: string;
    stderr?: string;
    returnValue?: any;
    errorDetails?: {
        name: string;
        message: string;
        stacktrace: string[];
    };
    metrics?: {
        cpuTimeMs: number;
        memoryPeakMB: number;
    };
}
