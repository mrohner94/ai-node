import { openai } from './openai.js'
import readline from 'node:readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const newMessage = async (history, message) => {
  const results = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...history, message],
    temperature: 0,
  })

  return results.choices[0].message
}

const formatMessage = (userInput) => ({ role: 'user', content: userInput })

const chat = () => {
  const history = [
    {
      role: 'system',
      content: 'You are an AI assistant.  Answer questions or else!',
    },
  ]

  const start = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close()
        return
      }

      console.log('debug 1')

      const message = formatMessage(userInput)
      const response = await newMessage(history, message)
      console.log('debug 2')

      history.push(message, response)
      console.log('debug 3')

      console.log(response)
      console.log(`\n\nAI: ${response.content}\n\n`)
      start()
    })
  }
  console.log('\n\nAI: How can I help you today?\n\n')
  start()
}

console.log('Chatbot initialized.  Type "exit" to end the chat.')
chat()
