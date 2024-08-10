import type { NextApiRequest, NextApiResponse } from 'next'
import { GenerateTextOutput } from 'utils/gemini';

type Data = {
  name: string
}
export const config = {
  maxDuration: 59,
};


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, input, type, imgUrl } = req.body;

    if (!prompt || !type) {
      console.log("input all content....");
      return res.status(400).json({ error: 'Prompt and input are required' });
    }
    if(type === "text" && !input){
      return res.status(400).json({ error: 'input is required' });
    }
    if(type === "img" && !imgUrl){
      return res.status(400).json({ error: 'imgUrl is required' });
    }
    if(type === "both" && (!input || !imgUrl)){
      return res.status(400).json({ error: 'input and imgUrl are required' });
    }
    console.log(prompt, input, type);
    const output = await GenerateTextOutput(prompt, input, type, imgUrl);
    console.log("output"+output);
    res.status(200).json({ content:output });
  } else {
    // res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}