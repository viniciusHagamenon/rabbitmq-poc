require('dotenv').config()

const amqp = require('amqplib')
const faker = require('faker')

const q = 'test'

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

    console.log('start producing!')
    
    for (var i = 0; i < 50000; i++) {
      const obj = {
        product: faker.commerce.product(),
        productName: faker.commerce.productName(),
        productMaterial: faker.commerce.productMaterial(),
        productAdjective: faker.commerce.productAdjective(),
        department: faker.commerce.department(),
        color: faker.commerce.color(),
        price: faker.commerce.price(),
      }
      channel.sendToQueue(q, new Buffer(JSON.stringify(obj)))
    }

    channel.close()
    
    console.log('done producing!')
  } catch (e) {
    console.error('Error:', e)
  }
}

module.exports = bootstrap()
