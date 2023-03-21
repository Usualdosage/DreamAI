# DreamAI
DreamAI is a lightweight (1.85k minified) Javascript library designed to easily interact with the OpenAI LLMs and Dall-E2 for content generation and image rendering.

In order to use this library, you will need to obtain an API key from OpenAI. You can do so here: https://platform.openai.com. Please be sure to protect your API key. *If you check it into source control, OpenAI will revoke it.*

## Usage

DreamAI is very simple to use. Instantiate the ES6 class with your API key, the language model, and options, then call the `Complete` or `Image` asynchronous functions to call the API.

These samples use the `gpt-4` LLM (which is the latest as of this writing), but you can optionally leverage several other models:

```javascript
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
```

Review the links provided above to understand the differences in these LLMs (there is a price per call difference as well).

#### Options

You can pass an (optional) options object (if using anything other than GPT-4 or GPT-3.5-Turbo) to tune your responses.

```javascript
let options = { 
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};
```

For more information about what these options mean, see: https://platform.openai.com/docs/api-reference/completions/create.

### Completions

Completions require a prompt and some level of training data. The training data will instruct the system on how you would like it to respond, and the prompt is the command you wish it to execute. See sample below.

```js
async function Complete() {
  let trainingData = ["Speak in a second person narrative voice.", "Your response should be between four and ten sentences."];
  let prompt = "Describe what I see when I look at a mongoose.";
  let dreamAI = new DreamAI("YOUR API KEY", DreamAI.GPT4, null);
  console.log("DreamAI: API call executing...please wait.");
  await dreamAI.Complete(prompt, trainingData, function (message) {
    document.getElementById("aiContent").innerText = message;
    console.log(message);
  });
}
```

### Images

Images are rendered directly from a prompt and do not require training data. Additionally, you don't need to specify a LLM (e.g. `DreamAI.GPT4`), but you will need to specify the width and the height of the image you wish to generate. OpenAI uses Dall-E 2 to render the images. There is both an `Image` and an `Images` endpoint. The latter will allow you to specify a count of images (up to 10) that you would like to generate. The response will be a temporary URL (or URLs) that you can render into a image, or alternatively, download and save to a file or storage.

```javascript
async function Image() {
    let prompt = "Give me a realistic photo of a mongoose walking on a dirt path in the woods.";
    let dreamAI = new DreamAI("YOUR API KEY", DreamAI.GPT4, null);
    console.log("DreamAI: API call executing...please wait.");
    await dreamAI.Image(prompt, 512, 512, function (url) {
        document.getElementById("aiImage").src = url;
        console.log(url);
    });
}
```

### Full Sample

To use this sample, download the `dreamia.js` code, then simply create an `index.html` file, drop this code into it, provide your API key, and run it in your favorite browser.

```html
<html>
  <head>
    <script type="text/javascript" src="dreamai.min.js"></script>
    <script type="text/javascript"> 

      const API_KEY = "YOUR API KEY";

      async function Complete() {
          let trainingData = ["Speak in a second person narrative voice.", "Your response should be between four and ten sentences."];
          let prompt = "Describe what I see when I look at a mongoose.";
          let dreamAI = new DreamAI(API_KEY, DreamAI.GPT4, null);
          console.log("DreamAI: API call executing...please wait.");
          await dreamAI.Complete(prompt, trainingData, function (message) {
              document.getElementById("aiContent").innerText = message;
              console.log(message);
          });
      }

      async function Image() {
          let prompt = "Give me a realistic photo of a mongoose walking on a dirt path in the woods.";
          let dreamAI = new DreamAI(API_KEY, DreamAI.GPT4, null);
          console.log("DreamAI: API call executing...please wait.");
          await dreamAI.Image(prompt, 512, 512, function (url) {
              document.getElementById("aiImage").src = url;
              console.log(url);
          });
      }

      async function Images() {
          let prompt = "Give me a realistic photo of a mongoose walking on a dirt path in the woods.";
          let dreamAI = new DreamAI(API_KEY, DreamAI.GPT4, null);
          console.log("DreamAI: API call executing...please wait.");
          await dreamAI.Images(prompt, 256, 256, 4, function (urls) {
              console.log(urls);
          });
      }

    </script>
  </head>
  <body>
    <h1 class="display-4">DreamAI Sample</h1>
    <button onclick="Complete()">Complete</button>
    <button onclick="Image()">Image</button>
    <button onclick="Images()">Images (4)</button>
    <img style="width:512px; height:512px; border: solid 1px #ccc;" id="aiImage" />
    <div style="width:512px; height:512px; border: solid 1px #ccc;" id="aiContent"></div>
    <div>
  </body>
</html>
```
