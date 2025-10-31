import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

const openAi = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

export default openAi
