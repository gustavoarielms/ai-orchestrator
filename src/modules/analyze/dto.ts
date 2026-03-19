export interface AnalyzeRequestDto {
  text: string;
}

export interface AnalyzeResponseDto {
  userStory: string;
  acceptanceCriteria: string[];
  tasks: string[];
}