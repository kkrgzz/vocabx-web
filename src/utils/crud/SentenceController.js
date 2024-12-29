import axios from 'utils/axios';

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