/**
 * Base URL for Tatoeba API requests.
 */
export const tatoeba_apiBaseUrl = 'https://api.tatoeba.org/unstable';
export const tatoeba_apiSentenceUrl = `${tatoeba_apiBaseUrl}/sentences`;

/**
 * Default language code for Tatoeba API requests.
 * This is set to English ('eng') by default, but can be changed based on user preferences or language of the word being searched.
 */
export const tatoeba_defaultLanguage = 'eng';

/**
 * Maximum number of sentences to be fetched from Tatoeba API per request.
 * This is set to a reasonable number to avoid overwhelming the user with too many options at once.
 * - default is 20 if not specified.
 */
export const tatoeba_sentenceLimit = 5;

/**
 * Minimum word count for sentences to be fetched from Tatoeba API.
 * This helps to filter out very short sentences that may not be useful for vocabulary learning.
 */
export const tatoeba_minWordCount = 4;

/**
 * Sort options:
    * relevance (prioritize sentences with exact matches, then sentences containing all the searched words, then shortest sentences)
    * words (order by number of words (or, if the language does not use spaces as word separators, by number of characters), shortest first)
    * -words (order by number of words, longest first)
    * created (order by sentence creation date (newest first))
    * -created (order by sentence creation date (oldest first))
    * modified (order by last sentence modification (last modified first))
    * random (randomly sort results)
*/
export const tatoeba_defaultSort = 'relevance'; 