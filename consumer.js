require('dotenv').config()

const amqp = require('amqplib')

const q = 'test'

function receiveMessage(channel, message) {
  if (message) {
    const object = JSON.parse(message.content.toString())
    console.log('received object:', object)
    channel.ack(message)
  }
}

async function bootstrap() {
  try {
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: process.env.HOSTNAME,
      port: process.env.PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      locale: 'en_US',
      frameMax: 0,
      heartbeat: 0,
      vhost: '/',
    })
    
    const channel = await connection.createChannel()
    
    await channel.assertQueue(q)

    console.log('start consuming!')
    await channel.consume(q, receiveMessage.bind(this, channel))
  } catch (e) {
    console.error('Error:', e)
  }
}

module.exports = bootstrap()
