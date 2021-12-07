import { WordPayload } from "../new-course/wordSetRequest.payload";

export interface WordSetUpdateRequestPayLoad {
  id: number;
  toLanguage: string;
  title: string;
  description: string;
  email: string;
  wordList: Array<WordUpdatePayload>;
}

export interface WordUpdatePayload {
  id: number | null;
  word: string;
  translation: string;
  description: string;
}

