export interface GqlInspectorOptions {
  slowThresholdMs?: number; // Default: 300ms
  verbose?: boolean; // Log all resolvers if true
}

export interface ResolverLog {
  field: string;
  duration: number;
  timestamp: string;
}
