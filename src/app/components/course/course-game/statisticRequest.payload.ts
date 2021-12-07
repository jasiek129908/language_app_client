export interface StatisitcRequestPayload {
  gameType: string;
  timeOfGameplay: number;
  mistakesList: Array<MistakesPerWord>;
  email: string;
  wordSetId: number;
}

export interface MistakesPerWord {
  word: string;
  errorCounter: number;
}
