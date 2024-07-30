import type { NextApiRequest, NextApiResponse } from 'next'
import { GenerateTextOutput } from 'utils/gemini';
type Data = {
  name: string
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, input, type } = req.body;

    if (!prompt || !input || !type) {
      console.log("output");
      return res.status(400).json({ error: 'Prompt and input are required' });
    }

    const output = await GenerateTextOutput(prompt, input, type);
    res.status(200).json({ content:output });
  } else {
    // res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}