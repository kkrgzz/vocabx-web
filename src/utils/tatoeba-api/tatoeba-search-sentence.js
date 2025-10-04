import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    tatoeba_apiSentenceUrl,
    tatoeba_defaultLanguage,
    tatoeba_sentenceLimit,
    tatoeba_minWordCount,
    tatoeba_defaultSort
} from './tatoeba-settings.js';
import { createSentence } from 'utils/crud/SentenceController.js';

export class TatoebaSentenceSearch {
    constructor(options = {}) {
        this.language = options.language || tatoeba_defaultLanguage;
        this.limit = options.limit || tatoeba_sentenceLimit;
        this.minWordCount = options.minWordCount || tatoeba_minWordCount;
        this.sort = options.sort || tatoeba_defaultSort;
    }

    /**
     * Build the API URL with query parameters
     * @param {string} query - The search query/word
     * @param {Object} overrides - Optional parameter overrides
     * @returns {string} Complete API URL
     */
    buildUrl(query, overrides = {}) {
        const params = new URLSearchParams({
            lang: overrides.language || this.language,
            q: query,
            word_count: `${overrides.minWordCount || this.minWordCount}-`,
            sort: overrides.sort || this.sort,
            limit: overrides.limit || this.limit
        });

        return `${tatoeba_apiSentenceUrl}?${params.toString()}`;
    }

    /**
     * Search for sentences containing the given query
     * @param {string} query - The search query/word
     * @param {Object} options - Optional search parameters
     * @returns {Promise<Object>} API response with sentences
     */
    async searchSentences(query, options = {}) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string');
        }

        const url = this.buildUrl(query, options);

        try {
            const response = await axios.get(url);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching sentences from Tatoeba:', error);
            throw new Error(`Failed to fetch sentences: ${error.message}`);
        }
    }

    /**
     * Extract just the sentence texts from the API response
     * @param {Object} apiResponse - Response from searchSentences
     * @returns {Array<string>} Array of sentence texts
     */
    extractSentenceTexts(apiResponse) {
        if (!apiResponse || !apiResponse.results) {
            return [];
        }

        return apiResponse.results.map(sentence => sentence.text);
    }

    /**
     * Extract full sentence objects with metadata
     * @param {Object} apiResponse - Response from searchSentences
     * @returns {Array<Object>} Array of sentence objects
     */
    extractSentenceObjects(apiResponse) {
        if (!apiResponse || !apiResponse.results) {
            return [];
        }

        return apiResponse.results.map(sentence => ({
            id: sentence.id,
            text: sentence.text,
            language: sentence.lang,
            user_id: sentence.user_id,
            correctness: sentence.correctness,
            script: sentence.script,
            created_at: sentence.created_at,
            updated_at: sentence.updated_at
        }));
    }
}

// Create a default instance
export const tatoebaSearcher = new TatoebaSentenceSearch();

/**
 * React Query hook for searching Tatoeba sentences
 * @param {string} word - The word to search for
 * @param {Object} options - Search options and React Query options
 * @returns {Object} React Query result object
 */
export const useTatoebaSentenceSearch = (word, options = {}) => {
    const {
        language,
        limit,
        minWordCount,
        sort,
        enabled = true,
        staleTime = 5 * 60 * 1000, // 5 minutes
        ...queryOptions
    } = options;

    const searcher = new TatoebaSentenceSearch({
        language,
        limit,
        minWordCount,
        sort
    });

    return useQuery({
        queryKey: ['tatoeba-sentences', word, language, limit, minWordCount, sort],
        queryFn: () => searcher.searchSentences(word),
        enabled: enabled && !!word,
        staleTime,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...queryOptions
    });
};

/**
 * React Query mutation hook for creating sentences from Tatoeba results
 * @param {Object} options - Mutation options
 * @returns {Object} React Query mutation object
 */
export const useTatoebaSentenceImport = (options = {}) => {
    return useMutation({
        mutationFn: async ({ sentence, word_id }) => createSentence(
            {
                word_id: word_id,
                sentence: sentence.text || '',
                is_tatoeba_imported: true,
                tatoeba_id: sentence.id || null
            }
        ),
        ...options
    });
};

/**
 * Utility function to get language code mapping for Tatoeba
 * Tatoeba uses 3-letter codes, this maps common 2-letter codes
 */
export const mapLanguageCodeForTatoeba = (languageCode) => {
    const languageMap = {
        'en': 'eng',
        'tr': 'tur',
        'es': 'spa',
        'fr': 'fra',
        'de': 'deu',
        'it': 'ita',
        'pt': 'por',
        'ru': 'rus',
        'ja': 'jpn',
        'ko': 'kor',
        'zh': 'cmn',
        'ar': 'ara'
    };

    return languageMap[languageCode] || languageCode;
};

export default TatoebaSentenceSearch;
