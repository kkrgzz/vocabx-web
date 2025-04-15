// AISentenceReviewButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';
import { AIClientWrapper } from 'utils/ai';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Eyeglasses } from '@phosphor-icons/react'; // Or choose another relevant icon like Sparkle, RateReviewOutlined etc.

function AISentenceReviewButton({
    word,
    sentence,
    sentenceId,
    prompt,
    onReviewStart,
    onReviewSuccess,
    onReviewEnd,
    color = 'info',
    showTooltip = true,
    tooltipTitle = "Review sentence with AI",
    disabled = false,
    icon: IconComponent = Eyeglasses,
}) {
    const [isReviewing, setIsReviewing] = useState(false);
    const { user } = useAuth();

    // Only initialize AI Client if the feature is enabled and we have the necessary info
    const aiClient = user?.profile?.is_ai_assistant_enabled && user?.profile?.api_key
        ? new AIClientWrapper(user.profile.api_key, user.profile.preferred_model_id)
        : null;

    // --- Improved Prompt for Sentence Review ---
    const defaultReviewPrompt = (word && sentence)
        ? `You are an AI language learning assistant. Your task is to review a sentence written by a student learning the word "${word.word}" in ${word.language_code}.

            Student's Sentence: "${sentence}"
            Target Word: "${word.word}"
            Language: ${word.language_code}

            Please review the sentence based *only* on the following criteria and provide your response *strictly* in the Markdown format below.

            **1. Original Sentence:**
            Replicate the student's sentence exactly as provided above.

            **2. Review & Corrections:**
            *   **Grammar & Spelling:** Briefly identify any grammatical or spelling errors. If none, state "Grammar and spelling are correct."
            *   **Word Usage:** Specifically evaluate if the target word "${word.word}" is used correctly in terms of meaning, context, and grammatical form (e.g., conjugation, declension if applicable). If incorrect, explain briefly why. If correct, state "The target word '${word.word}' is used appropriately."
            *   **Suggestions:** Offer brief, constructive suggestions for improvement regarding clarity, naturalness, or alternative phrasing if applicable. If the sentence is excellent, you can state "No suggestions needed."

            **3. Corrected Sentence:**
            If any corrections were identified in step 2, provide the full, corrected sentence here. If no corrections were needed, write "N/A".

            **Important Instructions:**
            *   Keep the review concise and focused on helping the student learn.
            *   Do NOT include any introductory or concluding remarks (e.g., "Here's the review:", "Great job!", "Keep practicing!").
            *   Respond ONLY with the formatted review starting directly with "**1. Original Sentence:**".
            *   Use Markdown for formatting as specified (bold headings, bullet points).
            `
        : ''; // Handle case where word or sentence might not be provided

    // Use provided prompt or generate the default one
    const reviewPrompt = prompt || defaultReviewPrompt;

    const handleReview = async () => {
        // Ensure AI client is available, not already reviewing, not externally disabled, and prompt is valid
        if (!aiClient || isReviewing || disabled || !reviewPrompt) {
            if (!reviewPrompt) console.error("Review prompt is empty. Check word and sentence props.");
            return;
        }

        try {
            setIsReviewing(true);
            onReviewStart?.(); // Notify parent that review started

            const response = await aiClient.getCompletion(reviewPrompt);

            if (response && response.content) {
                onReviewSuccess?.(response, sentenceId);
            } else {
                const errorMsg = 'AI review failed or returned empty content.';
                console.error(errorMsg, response);
            }

        } catch (error) {
            console.error('Error generating review:', error);
        } finally {
            setIsReviewing(false);
            onReviewEnd?.(); // Notify parent that review finished (success or fail)
        }
    }

    // Render nothing if AI is not enabled for the user or required props are missing
    if (!user?.profile?.is_ai_assistant_enabled || !aiClient || !word || !sentence) {
        if (!user?.profile?.is_ai_assistant_enabled || !aiClient) return null;
    }

    // Determine the actual disabled state
    const isDisabled = disabled || isReviewing || !word || !sentence; // Disable if reviewing or props missing

    const buttonContent = isReviewing
        ? <CircularProgress size={24} />
        : <IconComponent />; // Use the IconComponent prop

    const buttonElement = (
        <IconButton
            onClick={handleReview}
            color={color}
            disabled={isDisabled}
        >
            {buttonContent}
        </IconButton>
    );


    return showTooltip
        ? <Tooltip title={isReviewing ? "Reviewing..." : (isDisabled && (!word || !sentence) ? "Sentence required for review" : tooltipTitle)}>
            {/* Tooltip requires a DOM element child if the child component might be disabled. */}
            <span>
                {buttonElement}
            </span>
        </Tooltip>
        : buttonElement;
}

AISentenceReviewButton.propTypes = {
    /** The word object containing 'word' and 'language_code' */
    word: PropTypes.shape({
        word: PropTypes.string.isRequired,
        language_code: PropTypes.string.isRequired
    }).isRequired, // Word context is required
    /** The user-written sentence text to be reviewed */
    sentence: PropTypes.string.isRequired, // Sentence is required for review
    sentenceId: PropTypes.number.isRequired, // Sentence ID is required for tracking
    /** Optional custom prompt to override the default review instructions */
    prompt: PropTypes.string,
    /** Callback function invoked when the AI review process starts */
    onReviewStart: PropTypes.func,
    /** Callback function invoked on successful AI review. Receives the full response object from the AI client. */
    onReviewSuccess: PropTypes.func,
    /** Callback function invoked when the AI review process ends (after success or failure) */
    onReviewEnd: PropTypes.func,
    // onError: PropTypes.func, // Optional: Define shape if added
    /** The color of the button */
    color: PropTypes.string,
    /** Whether to show a tooltip on hover */
    showTooltip: PropTypes.bool,
    /** Custom title for the tooltip */
    tooltipTitle: PropTypes.string,
    /** Whether the button is disabled externally */
    disabled: PropTypes.bool,
    /** Allows overriding the default icon component */
    icon: PropTypes.elementType,
};

export default AISentenceReviewButton;