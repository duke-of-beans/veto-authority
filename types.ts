export interface VetoConfig {
  baseThreshold: number;
  decayRate: number;
  resetOnDomainChange: boolean;
  resetOnError: boolean;
}

export interface VetoResult {
  passed: boolean;
  inputScore: number;
  threshold: number;
  sessionAge: number;
  reason?: string;
}
