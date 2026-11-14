// Approximate English syllable positions for the dialogue voice: one blip per
// syllable as the typewriter reaches it. A vowel-group heuristic is plenty
// for a sound cue; it does not need to be linguistically exact.

const VOWEL = /[aeiouy]/i;

// Returns the number of syllables in a single word (letters only, min 1).
export function countSyllables(word) {
  const letters = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!letters) return 0;
  let groups = 0;
  let inVowelGroup = false;
  for (const letter of letters) {
    const isVowel = VOWEL.test(letter);
    if (isVowel && !inVowelGroup) groups += 1;
    inVowelGroup = isVowel;
  }
  // Silent trailing e ("time"), but not "-le" after a consonant ("table").
  if (letters.length > 2 && letters.endsWith('e') && !letters.endsWith('le') && !VOWEL.test(letters[letters.length - 2])) groups -= 1;
  if (letters.endsWith('es') && letters.length > 3 && !/[sxz]es$|[cs]hes$/.test(letters)) groups -= 1;
  if (/[aeiou]ing$/.test(letters)) groups += 1; // "going", "seeing": the vowel before -ing is its own syllable
  return Math.max(1, groups);
}

// Character offsets in `text` where a syllable begins, spread evenly through
// each word, so the blips land while that word is being typed.
export function syllableOnsets(text) {
  const onsets = new Set();
  const wordPattern = /\S+/g;
  let match;
  while ((match = wordPattern.exec(text)) !== null) {
    const count = countSyllables(match[0]);
    for (let index = 0; index < count; index++) {
      onsets.add(match.index + Math.floor((match[0].length * index) / count));
    }
  }
  return onsets;
}
