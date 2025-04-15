import OpenAI from 'openai';

export class AIClientWrapper {
    constructor(apiKey, preferredModelId) {
        this.preferredModelId = preferredModelId;
        // Ensure API key is provided before creating the client
        if (!apiKey) {
            console.error("AI Client Wrapper initialized without API Key!");
            // Handle this case appropriately, maybe throw an error or set client to null
            this.client = null;
            return;
        }
        this.client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey,
            dangerouslyAllowBrowser: true, // Be very cautious with this in production
        });
    }

    async getCompletion(message) {
        // Check if client was initialized properly
        if (!this.client) {
            console.error("AI Client not available (missing API key?).");
            return null; // Return null to indicate failure
        }

        const startTime = performance.now();
        let completion;

        try {
            completion = await this.client.chat.completions.create({
                model: this.preferredModelId || 'openrouter/auto', // Use 'openrouter/auto' or a sensible default
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
            });

            const endTime = performance.now();
            const elapsedTime = (endTime - startTime).toFixed(2);

            // --- **CRITICAL CHECK**: Verify the response structure ---
            const messageContent = completion?.choices?.[0]?.message?.content;
            const messageRole = completion?.choices?.[0]?.message?.role; // Optional: capture role

            if (!messageContent) {
                console.error('Invalid or empty completion response structure from AI:', completion);
                // You might want to check completion.error or other fields if the API returns errors differently
                return null; // Indicate failure
            }

            // --- **STRUCTURED RESPONSE** ---
            // Return an object containing the necessary data
            return {
                content: messageContent,
                role: messageRole || 'assistant', // Default role if needed
                usage: completion.usage || null, // Attach usage if available
                elapsed_time: elapsedTime,
                // You could include the raw completion object if needed for debugging elsewhere
                // raw_completion: completion
            };

        } catch (error) {
            console.error('Error during AI API call in getCompletion:', error);
            // Log more specific OpenAI/API errors if possible
            if (error instanceof OpenAI.APIError) {
                console.error('API Error Status:', error.status);
                console.error('API Error Message:', error.message);
                console.error('API Error Code:', error.code);
                console.error('API Error Type:', error.type);
            } else {
                console.error('Non-API Error:', error.message); // Network errors, etc.
            }
            return null; // Indicate failure by returning null
        }
    }
}