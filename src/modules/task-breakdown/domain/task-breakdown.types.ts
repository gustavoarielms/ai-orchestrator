export type TaskBreakdownRequest = {
  text: string;
};

export type TaskBreakdownResponse = {
  tasks: string[];
  technicalApproach: string;
  tests: string[];
  definitionOfDone: string[];
};
