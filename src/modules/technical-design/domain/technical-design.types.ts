export type TechnicalDesignRequest = {
  text: string;
};

export type TechnicalDesignResponse = {
  architecture: string;
  components: string[];
  risks: string[];
  observability: string[];
  rolloutPlan: string[];
};
