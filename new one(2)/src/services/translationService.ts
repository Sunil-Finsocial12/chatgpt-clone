// This is a mock translation service. Replace with actual API calls in production
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));

  // This is just a mock translation. Replace with actual API call
  const mockTranslations: { [key: string]: (text: string) => string } = {
    'hin_Deva': (text) => `Hindi: ${text}`,
    'ben_Beng': (text) => `Bengali: ${text}`,
    'guj_Gujr': (text) => `Gujarati: ${text}`,
    'kan_Knda': (text) => `Kannada: ${text}`,
    'mal_Mlym': (text) => `Malayalam: ${text}`,
    'mar_Deva': (text) => `Marathi: ${text}`,
    'eng_Latn': (text) => text, // No translation needed for English
  };

  return mockTranslations[targetLang]?.(text) || text;
};
