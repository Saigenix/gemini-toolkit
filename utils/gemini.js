const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const INSTRUCTION_PROMPT =
  "Execute the above prompt on the following input, delimited by three backticks";

export const GenerateTextOutput = async (prompt, input, type) => {
  if (type === "text") {
    var TempOutput = input;
    for (let i = 0; i < prompt.length; i++) {
      var combinedPrompt = `${prompt[i]}.${INSTRUCTION_PROMPT} \n \`\`\`${TempOutput}\`\`\` `;
      console.log(combinedPrompt);
      TempOutput = await GeminiOutText(combinedPrompt);
    }
    return TempOutput;
  } else if (type === "image") {
  } else if (type === "both") {
  } else {
    return "Something Went Wrong!";
  }
};

const GeminiOutText = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
};
