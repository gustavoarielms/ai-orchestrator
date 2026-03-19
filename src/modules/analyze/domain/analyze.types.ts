export interface AnalyzeRequest {
  text: string;
}

export interface AnalyzeResponse {
  userStory: string;
  acceptanceCriteria: string[];
  tasks: string[];
}