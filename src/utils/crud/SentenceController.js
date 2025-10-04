import axios from 'utils/axios';

export const createSentence = async (data) => {
  try {
    console.log(data);
    const response = await axios.post('/api/sentences', {
      word_id: data.word_id,
      sentence: data.sentence,
      is_tatoeba_imported: data.is_tatoeba_imported || false,
      tatoeba_id: data.tatoeba_id || null,
      is_ai_generated: data.is_ai_generated || false,
      ai_review: data.ai_review || null,
      ai_elapsed_time: data.ai_elapsed_time || null,
      ai_prompt_tokens: data.ai_prompt_tokens || null,
      ai_completion_tokens: data.ai_completion_tokens || null
    });
    return response?.data || {};
  } catch (error) {
    console.error('Error adding sentence:', error);
    throw error;
  }
};

export const createSentences = async (sentences) => {
  try {
    const response = await axios.post('/api/sentences', {
      sentences: sentences
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error adding sentence:', error);
    throw error;
  }
};

export const deleteSentence = async (sentenceId) => {
  try {
    await axios.delete(`/api/sentences/${sentenceId}`);
    return true;
  } catch (error) {
    console.error('Error deleting sentence:', error);
    throw error;
  }
};