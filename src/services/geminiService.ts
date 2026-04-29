export async function getWordExplanation(word: string, meaning_vi: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: "You are a friendly educational assistant for Vietnamese Grade 4 students (9-10 years old). Explain English words simply in both English and Vietnamese. Keep it very short and encouraging.",
        prompt: `Please explain the word "${word}" which means "${meaning_vi}" to a 10-year old Vietnamese child.`
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I couldn't think of an explanation right now. Keep practicing!";
  }
}

export function getQuizFeedback(isCorrect: boolean, attempts: number) {
  if (isCorrect) {
    const praises = ["Excellent!", "Great job!", "You are a star!", "Perfect!", "Keep it up!"];
    return praises[Math.floor(Math.random() * praises.length)];
  } else {
    if (attempts < 2) {
      return "Almost there! Try again.";
    }
    return "Don't worry, even geniuses make mistakes. Let's try another one!";
  }
}
