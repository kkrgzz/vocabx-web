// AICompletionButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { AIClientWrapper } from 'utils/ai';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Brain } from '@phosphor-icons/react';

function AICompletionButton({
    word,
    prompt, // Optional: Allow overriding the default prompt
    onCompletionStart,
    onCompletionSuccess,
    onCompletionEnd,
    color = 'primary',
    showTooltip = true,
    tooltipTitle = "Generate a Completion with AI",
    disabled = false, // Parent can disable the button externally
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { user } = useAuth();
    
    // Only initialize AI Client if the feature is enabled and we have the necessary info
    const aiClient = user?.profile?.is_ai_assistant_enabled && user?.profile?.api_key
        ? new AIClientWrapper(user.profile.api_key, user.profile.preferred_model_id)
        : null;

    // Use provided prompt or generate the default one
    const generationPrompt = prompt || (word
        ? `You should write a sentence with the word "${word.word}". This word is from "${word.language_code}" language. I am trying to learn this word. Please write your example sentence in "${word.language_code}" language. You should write just a single sentence. Do not write any instructions or explanations.`
        : ''); // Handle case where word might not be provided initially

    const handleCompletion = async () => {
        // Ensure AI client is available, not already generating, not externally disabled, and prompt is valid
        if (!aiClient || isGenerating || disabled || !generationPrompt) return;

        try {
            setIsGenerating(true);
            onCompletionStart?.(); // Notify parent that generation started

            const response = await aiClient.getCompletion(generationPrompt);

            if (response && response.content) {
                //console.log('AI Completion Succeeded:', response.content);
                onCompletionSuccess?.(response); // Pass the result back to the parent
            } else {
                 console.error('AI Completion failed or returned empty content.');
                 // Optionally add an onError callback prop if needed
                 // onError?.(new Error('AI Completion failed or returned empty content.'));
            }

        } catch (error) {
            console.error('Error generating completion:', error);
            // Optionally add an onError callback prop if needed
            // onError?.(error);
        } finally {
            setIsGenerating(false);
            onCompletionEnd?.(); // Notify parent that generation finished (success or fail)
        }
    }

    // Render nothing if AI is not enabled for the user
    if (!user?.profile?.is_ai_assistant_enabled || !aiClient) {
        return null;
    }

    // Determine the actual disabled state
    const isDisabled = disabled || isGenerating;

    const buttonContent = isGenerating
        ? <CircularProgress size={24} />
        : <Brain />;

    const buttonElement = (
        <IconButton
            onClick={handleCompletion}
            color={color}
            disabled={isDisabled}
        >
            {buttonContent}
        </IconButton>
    );


    return showTooltip
        ? <Tooltip title={isGenerating ? "Generating..." : tooltipTitle}>
            {/* Tooltip requires a DOM element child if the child component might be disabled.
                Wrapping with a span is a common solution. */}
            <span>
                {buttonElement}
            </span>
          </Tooltip>
        : buttonElement;
}

AICompletionButton.propTypes = {
    word: PropTypes.shape({
        word: PropTypes.string.isRequired,
        language_code: PropTypes.string.isRequired
    }),
    prompt: PropTypes.string,
    onCompletionStart: PropTypes.func,
    onCompletionSuccess: PropTypes.func, // Callback function receiving the generated text
    onCompletionEnd: PropTypes.func,
    color: PropTypes.string,
    showTooltip: PropTypes.bool,
    tooltipTitle: PropTypes.string,
    disabled: PropTypes.bool,
};

export default AICompletionButton;