export type DevelopmentRequest = {
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
  taskBreakdown: {
    tasks: string[];
    technicalApproach: string;
    tests: string[];
    definitionOfDone: string[];
  };
  implementationContext: {
    framework: "nestjs";
    language: "typescript";
    testingFramework: "jest";
    architectureStyle: "modular";
    logging: "nestjs-logger";
  };
};

export type DevelopmentResponse = {
  filesToChange: string[];
  codeChanges: Array<{
    file: string;
    changeType: "create" | "update";
    summary: string;
    content: string;
  }>;
  testsToAdd: Array<{
    file: string;
    summary: string;
    content: string;
  }>;
  notes: string[];
};
