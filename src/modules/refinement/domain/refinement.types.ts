export type RefineRequest = {
  text: string;
};

export type RefineResponse = {
  problem: string;
  goal: string;
  userStory: string;
  acceptanceCriteria: string[];
  edgeCases: string[];
};