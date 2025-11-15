// ElevenLabs voice mapping for different languages
// Based on ElevenLabs multilingual voice library

export const LANGUAGE_VOICE_MAP: Record<string, string> = {
  // Hindi
  'HI': 'RBxPIvrKOP4ugCK2jVHD',
  // Filipino
  'FIL': '1ZA0KgPdD0Tns6SR4FVQ',
  // Turkish
  'TR': '0DihkedLJYKoWg7H1u4d',
  // Korean
  'KO': '9vTWeZwjAkqIiZJdCarV',
  // Croatian
  'HR': 'TRnNlYQWHAJwo9K75wNE',
  // Russian
  'RU': 'd60rsXo2p0OwikDR5bS7',
  // Romanian
  'RO': 'znn3xedzq0kO6JXbSRB6',
  // Indonesian
  'ID': 'TMvmhlKUioQA4U7LOoko',
  // Greek
  'EL': 'ejJ1ETWS2ohLMMeCu1H3',
  // Portuguese
  'PT': 'UkO7OCLgMp3WYf4UPjE5',
  // Swedish
  'SV': 'aSLKtNoVBZlxQEMsnGL2',
  // French
  'FR': 'lvQdCgwZfBuOzxyV5pxu',
  // English (default)
  'EN': 'b6UtgdzviyF3kdUzNIlT',
  // Polish
  'PL': 'XP3c7PKDwbCj3z2cnpa9',
  // Slovak
  'SK': 'T4CPtAHlrClEH8iCFo2h',
  // Tamil
  'TA': 'DNLl3gCCSh2dfn1WDBpZ',
  // Spanish
  'ES': 'iJQjCIhyynnZMKT6NN3H',
  // Danish
  'DA': '6SjhOkgKPuHxm8q0eIyp',
  // German
  'DE': 'KbSC2XTZL12xT3fm2fcD',
  // Japanese
  'JA': 'b6UtgdzviyF3kdUzNIlT', // Using English voice as fallback
  // Arabic
  'AR': 'b6UtgdzviyF3kdUzNIlT', // Using English voice as fallback
  // Chinese
  'ZH': 'b6UtgdzviyF3kdUzNIlT', // Using English voice as fallback
};

// Default voice (English)
export const DEFAULT_VOICE_ID = 'b6UtgdzviyF3kdUzNIlT';

/**
 * Get the appropriate ElevenLabs voice ID for a given language code
 * @param languageCode - ISO 639-1 language code (e.g., 'en', 'es', 'fr')
 * @returns ElevenLabs voice ID
 */
export function getVoiceIdForLanguage(languageCode: string): string {
  const normalizedCode = languageCode.toUpperCase();
  return LANGUAGE_VOICE_MAP[normalizedCode] || DEFAULT_VOICE_ID;
}

/**
 * Get voice ID from an array of language codes (picks the first non-English language if available)
 * @param languageCodes - Array of language codes (e.g., ['FR', 'EN'])
 * @returns ElevenLabs voice ID
 */
export function getVoiceIdFromLanguages(languageCodes: string[]): string {
  // Prioritize non-English languages for more authentic voice
  const nonEnglish = languageCodes.find(code => code.toUpperCase() !== 'EN');
  const primaryLanguage = nonEnglish || languageCodes[0] || 'EN';
  return getVoiceIdForLanguage(primaryLanguage);
}
