export interface WordSetResponsePayLoad {
  id: number;
  toLanguage: string;
  title: string;
  description: string;
  wordList: Array<WordResponsePayload>;
  creationTime: number;
  isShared: boolean;
}

export interface WordResponsePayload {
  id: number;
  word: string;
  translation: string;
  description: string;
}
