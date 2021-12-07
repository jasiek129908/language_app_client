import { MistakesPerWord } from "../../course/course-game/statisticRequest.payload";

export interface StatisitcResponsePayload {
  timeOfGameplay: number;
  mistakesList: Array<MistakesPerWord>;
  createDate: Date;
}

