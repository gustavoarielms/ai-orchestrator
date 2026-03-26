export type TaskBreakdownSource = {
  analysis: {
    userStory: string;
    acceptanceCriteria: string[];
    tasks: string[];
  };
  technicalDesign: {
    architecture: string;
    components: string[];
    risks: string[];
    observability: string[];
    rolloutPlan: string[];
  };
};

export type TaskBreakdownRequest = {
  source: TaskBreakdownSource;
};

export type TaskBreakdownResponse = {
  tasks: string[];
  technicalApproach: string;
  tests: string[];
  definitionOfDone: string[];
};
