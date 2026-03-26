export type TechnicalDesignSource = {
  userStory: string;
  acceptanceCriteria: string[];
  tasks: string[];
};

export type TechnicalDesignRequest = {
  source: TechnicalDesignSource;
};

export type TechnicalDesignResponse = {
  architecture: string;
  components: string[];
  risks: string[];
  observability: string[];
  rolloutPlan: string[];
};
