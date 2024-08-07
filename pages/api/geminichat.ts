import type { NextApiRequest, NextApiResponse } from 'next'
import { chatWithGemini } from 'utils/gemini';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { chatHistory, message } = req.body;

    // console.log(chatHistory.history[0], message);
    const output = await chatWithGemini(chatHistory, message);
    // console.log("output: "+output);
    res.status(200).json({ content:output });
  } else {
    // res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}