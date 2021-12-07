import { WordSetResponsePayLoad } from "../courses/allWordSetResponse.payload";

export interface SharedWordSetResponsePayload {
  id: number;
  likesCount: number;
  wordSet: WordSetResponsePayLoad;
  author: string;
}
