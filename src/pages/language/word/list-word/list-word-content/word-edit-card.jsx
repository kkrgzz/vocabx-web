import { SaveOutlined } from '@ant-design/icons';
import { Button, Chip, Divider, TextField } from '@mui/material';
import React, { useState } from 'react'

function WordEditCard({
    editedWord,
    setEditedWord,
    handleSaveEdit
}) {
    const [originalWord] = useState(JSON.parse(JSON.stringify(editedWord)));

    const hasChanges = () => {
        // Check if word text changed
        if (editedWord?.word !== originalWord?.word) {
            return true;
        }

        // Check if language changed
        if (editedWord?.language?.code !== originalWord?.language?.code) {
            return true;
        }

        // Check translations changes
        if (editedWord?.translations && originalWord?.translations) {
            const hasTranslationChanges = editedWord.translations.some((translation, index) => {
                const originalTranslation = originalWord.translations[index];
                if (!originalTranslation) return true;

                return translation.translation !== originalTranslation.translation;
            });

            if (hasTranslationChanges) {
                return true;
            }
        }

        // Check sentences changes
        if (editedWord?.sentences && originalWord?.sentences) {
            return editedWord.sentences.some((sentence, index) => {
                const originalSentence = originalWord.sentences[index];
                if (!originalSentence) return true;
                return sentence.sentence !== originalSentence.sentence;
            });
        }

        return false;
    };

    return (
        <>
            <TextField
                fullWidth
                label="Word"
                value={editedWord?.word || ''}
                onChange={(e) => setEditedWord({ ...editedWord, word: e.target.value })}
                margin="dense"
            />

            {
                //TRANSLATIONS SECTION
                editedWord?.translations.length > 0 && (
                    <Divider>
                        <Chip label="Translations" color='warning' />
                    </Divider>
                )
            }
            {editedWord?.translations?.map((translation, index) => (
                <div key={index}>
                    <TextField
                        fullWidth
                        label={`${translation.language.name || 'Translation'}}`}
                        value={translation.translation || ''}
                        onChange={(e) => {
                            const newTranslations = [...editedWord.translations];
                            newTranslations[index].translation = e.target.value;
                            setEditedWord({ ...editedWord, translations: newTranslations });
                        }}
                        margin="dense"
                    />
                </div>
            ))}

            {
                //SENTENCES SECTION
                editedWord?.sentences.length > 0 && (
                    <Divider>
                        <Chip label="Sentences" color='error' />
                    </Divider>
                )
            }
            {editedWord?.sentences?.map((sentence, index) => (
                <div key={index}>
                    <TextField
                        fullWidth
                        value={sentence.sentence}
                        onChange={(e) => {
                            const newSentences = [...editedWord.sentences];
                            newSentences[index].sentence = e.target.value;
                            setEditedWord({ ...editedWord, sentences: newSentences });
                        }}
                        margin="dense"
                    />
                </div>
            ))}

            <Button
                onClick={handleSaveEdit}
                startIcon={<SaveOutlined />}
                variant="contained"
                color="primary"
                fullWidth
                disabled={!hasChanges()}
                sx={{ mt: 1 }}
            >
                Save
            </Button>
        </>
    )
}

export default WordEditCard