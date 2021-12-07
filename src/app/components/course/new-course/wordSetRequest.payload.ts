export interface WordSetRequestPayLoad {
  toLanguage: string;
  title: string;
  description: string;
  email: string;
  wordList: Array<WordPayload>;
}

export interface WordPayload {
  word: string;
  translation: string;
  description: string;
}
