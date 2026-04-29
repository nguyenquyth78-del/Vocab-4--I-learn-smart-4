import { VocabularyWord, Unit } from '../types';

export const UNITS_DATA: Unit[] = [
  {
    unit_id: 1,
    title: "Animals",
    description: "Learn about animals",
    order: 1
  }
];

export const VOCABULARY_DATA: VocabularyWord[] = [
  {
    id: "u1_001",
    unit_id: 1,
    word: "tiger",
    ipa: "/ˈtaɪɡər/",
    meaning_vi: "con hổ",
    audio_url: "audio/tiger.mp3",
    image_url: "images/tiger.png",
    example: "The tiger is strong.",
    example_vi: "Con hổ rất khỏe.",
    part_of_speech: "noun",
    difficulty: "easy"
  },
  {
    id: "u1_002",
    unit_id: 1,
    word: "elephant",
    ipa: "/ˈelɪfənt/",
    meaning_vi: "con voi",
    audio_url: "audio/elephant.mp3",
    image_url: "images/elephant.png",
    example: "The elephant is big.",
    example_vi: "Con voi rất to.",
    part_of_speech: "noun",
    difficulty: "easy"
  },
  {
    id: "u1_003",
    unit_id: 1,
    word: "monkey",
    ipa: "/ˈmʌŋki/",
    meaning_vi: "con khỉ",
    audio_url: "audio/monkey.mp3",
    image_url: "images/monkey.png",
    example: "The monkey can climb.",
    example_vi: "Con khỉ có thể leo trèo.",
    part_of_speech: "noun",
    difficulty: "easy"
  }
];
