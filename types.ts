export enum VerificationStatus {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  PARTIALLY_TRUE = 'PARTIALLY_TRUE',
  UNVERIFIABLE = 'UNVERIFIABLE',
  OPINION = 'OPINION',
  PENDING = 'PENDING'
}

export interface FactCheckResult {
  id: string;
  originalText: string;
  status: VerificationStatus;
  explanation: string;
  correction?: string; // Only if false
  sources: Array<{ title: string; uri: string }>;
  timestamp: number;
}

export interface TranscriptSegment {
  text: string;
  isFinal: boolean;
}
