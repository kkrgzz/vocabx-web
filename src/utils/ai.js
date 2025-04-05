import OpenAI from 'openai';

export class AIClientWrapper {
  constructor(apiKey, preferredModelId) {
    this.preferredModelId = preferredModelId;
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async getCompletion(message) {
    const startTime = performance.now();
    const completion = await this.client.chat.completions.create({
      model: this.preferredModelId || 'default-model',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });
    const endTime = performance.now();

    // Prepare the response message
    const response = completion?.choices[0]?.message || null;
    response['usage'] = completion?.usage || null;
    response['elapsed_time'] = (endTime - startTime).toFixed(2);
    console.log(response);
    return response;
  }
}