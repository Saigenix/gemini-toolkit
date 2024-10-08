const { GoogleGenerativeAI } = require("@google/generative-ai");
import axios from "axios";
import fs from "fs/promises";
import path from "path";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Your Friendly chatBot In the gemini toolkit website, when some one ask how are you reply with fine welcome to gemini toolkit in this website users create tools and there are two ways to create a tool simple and complex using complex tool creation. users can create multi level complex tools with multiple prompt chaining using node based graph tool after tool creation user can access tool in his profile and set to public or private on home screen there are lot of tools which user can use like share and save into favorite also user must be logged in to create a tool, example of tools are like resume builder travel planner etc. also we create tools which can take image input!",
});

const INSTRUCTION_PROMPT =
  "Execute the above prompt on the following input, delimited by three backticks";
const INSTRUCTION_PROMPT2 =
  "Execute the above prompt on the following input, delimited by three backticks and provided image";

export const GenerateTextOutput = async (prompt, input, type, imgUrl) => {
  // console.log(imgUrl);
  logToFile(
    `prompt: ${prompt} \n, input: ${input} \n, type: ${type} \n, imgUrl: ${imgUrl}\n`
  );
  if (type === "text") {
    var combinedPrompt = `${prompt}.${INSTRUCTION_PROMPT} \n \`\`\`${input}\`\`\` `;
    console.log(combinedPrompt);
    const Output = await GeminiOutText(combinedPrompt);
    logToFile(`output: ${Output}`);
    return Output;
  } else if (type === "img") {
    const image = {
      inlineData: {
        data: await imageUrlToBase64(imgUrl),
        mimeType: "image/png",
      },
    };
    const result = await model.generateContent([prompt, image]);
    // console.log(result.response.text());
    logToFile(`output: ${result.response.text()}`);
    return result.response.text();
  } else if (type === "both") {
    const image = {
      inlineData: {
        data: await imageUrlToBase64(imgUrl),
        mimeType: "image/png",
      },
    };
    var combinedPrompt = `${prompt}.${INSTRUCTION_PROMPT2} \n \`\`\`${input}\`\`\` `;
    const result = await model.generateContent([combinedPrompt, image]);
    // console.log(result.response.text());
    logToFile(`output: ${result.response.text()}`);
    return result.response.text();
  } else {
    return "Something Went Wrong!";
  }
};

const imageUrlToBase64 = async (imageUrl) => {
  let image = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  return Buffer.from(image.data).toString("base64");
};

const GeminiOutText = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("Content generated successfully...");
  return text;
};

export async function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: \n${message}\n`;
  const logFilePath = path.join(process.cwd(), "logs", "app.log");

  try {
    await fs.mkdir(path.dirname(logFilePath), { recursive: true });
    await fs.appendFile(logFilePath, logEntry);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}

export async function chatWithGemini(chatHistory, message) {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  const chat = ChatModel.startChat(chatHistory);
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();
  return text;
}
