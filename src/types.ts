export enum WordCategory {
  ANIMALS = "Animals",
  ACTIVITIES = "Activities",
  FOOD = "Food",
  SCHOOL = "School",
}

export interface Unit {
  unit_id: number;
  title: string;
  description: string;
  order: number;
}

export interface VocabularyWord {
  id: string;
  unit_id: number;
  word: string;
  ipa: string;
  meaning_vi: string;
  audio_url?: string;
  image_url?: string;
  example: string;
  example_vi: string;
  part_of_speech: string;
  difficulty: string;
}

export interface QuizQuestion {
  id: string;
  type: 'spelling' | 'meaning' | 'listening' | 'scrambled';
  word: VocabularyWord;
  options?: string[];
  correctAnswer: string;
}

export interface PronunciationTopic {
  id: string;
  title: string;
  theory: string;
  examples: { word: string; category: string }[];
}
