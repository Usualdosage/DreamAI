/*
 * DreamAI is a lightweight Javascript class designed to interact with the OpenAI API for completions and images.
 * To register for an OpenAI account, please go to: https://platform.openai.com/
 * Once you have your API key, you can use these methods to generate completions and images
 * using the language model of your choice.
 * DreamAI is (c) Matthew Martin, 2023.
 * https://www.dreaminhex.com
 */
class DreamAI {

    /* Available (most common) language models for OpenAI */
    /* See: https://platform.openai.com/docs/models/gpt-3 */
    /* https://platform.openai.com/docs/models/gpt-4 */
    static get GPT4() { return "gpt-4"; }
    static get GPT35() { return "gpt-3.5-turbo"; }
    static get DaVinci003() { return "text-davinci-003"; }
    static get DaVinci002() { return "text-davinci-002"; }
    static get DaVinci001() { return "text-davinci-001"; }
    static get Curie001() { return "text-curie-001"; }
    static get Babbage001() { return "text-babbage-001"; }
    static get Ada001() { return "text-ada-001"; }

    /* Construct the DreamAI class using your OpenAPI key, and provide the model you wish to use. Additional parameters
     * can be used to tune the model to respond in a specific way.
    */
    constructor(openAIKey, model, options) {
        this.openAIKey = openAIKey;
        this.model = model;

        if (this.model[0] !== 'g') {
            this.temperature = options.temperature;
            this.top_p = options.top_p;
            this.frequency_penalty = options.frequency_penalty;
            this.presence_penalty = options.presence_penalty;
        }
    }

    /* Provide a prompt, and training data, and the system will return a message. */
    async Complete(prompt, trainingData, callback) {

        let messages = [];

        messages[0] =
        {
            role: "system",
            content: trainingData.join(' '),
        };

        messages[1] =
        {
            role: "assistant",
            content: prompt,
        };

        let request =
        {
            messages: messages,
            model: this.model,
            max_tokens: this.model[0] === 'g' ? 4096 : 512
        };

        // Only use the options settings for non-GPT models.
        if (this.model[0] !== 'g') {
            request.temperature = this.temperature === null ? 0.7 : this.temperature;
            request.top_p = this.top_p === null ? 1 : this.top_p;
            request.frequency_penalty = this.frequency_penalty === null ? 0 : this.frequency_penalty;
            request.presence_penalty = this.presence_penalty === null ? 0 : this.presence_penalty;
        }

        let data = await this.#postAsync("https://api.openai.com/v1/chat/completions", request);

        if (data) {
            var responseMessage = data.choices[0].message.content;
            callback(responseMessage);
        }
        else {
            console.log("DreamAI: No data was returned. Check your API key.");
        }
    }

    /* Provide a prompt and image size to return a single URL of the generated image. */
    async Image(prompt, width, height, callback) { 
       await this.Images(prompt, width, height, 1, callback);
    }

    /* Provide a prompt, image size, and count of images (no more than 10) to return a list of image URLs. */
    async Images(prompt, width, height, count, callback) {

        if (count > 10) {
            console.log("DreamAI: No more than 10 images are allowed.");
        }
        else {
            let request =
            {
                prompt: this.#formatPrompt(prompt),
                n: count,
                size: width + "x" + height
            };

            let data = await this.#postAsync("https://api.openai.com/v1/images/generations", request, callback);

            if (data) {
                if (count === 1) {
                    var imageUrl = data.data[0].url;
                    callback(imageUrl);
                }
                else {
                    var urls = [];
                    data.data.map((i) => urls.push(i.url));
                    callback(urls);
                }
            }
            else {
                console.log("DreamAI: No data was returned. Check your API key.");
            }
        }
    }
   
    #formatPrompt(prompt) {
        if (prompt.length <= 400) {
            return prompt;
        }
        else {
            return prompt.substring(0, 399);
        }
    }

    async #postAsync(url, json) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.openAIKey
            },
            body: JSON.stringify(json)
        })
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });
    }
}
