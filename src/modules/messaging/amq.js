const amqp = require('amqplib');
const { alert } = require('./keyes')

const MQ = {};

let conn;

async function connect() {
  try {

    console.log('connecting rabbit mq');
    conn = await amqp.connect(global.services.rabbitmq.url);
    console.log('connected rabbit mq');

    MQ.channel = await conn.createChannel();

    return Promise.resolve('connected');
  }catch(err) {
    console.log(`connect error ${err}`)
    return 'connection failed';
  }
}

function onConnectError() {
  setTimeout(async () => {
    await connect();
  }, 1000);
}

async function initConnection() {
  try {
    await connect('start', onConnectError);
    console.log('channel connected');
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function initMQ() {
  if (!MQ.channel) await initConnection();

  await MQ.channel.assertExchange(
    alert.exchange.exchange, 
    alert.exchange.type, 
    { durable: alert.exchange.durable, autoDelete: alert.exchange.auto_delete }
    );

  const { queue_critical, queue_rate_limit } = alert
  const queueCritical = await MQ.channel.assertQueue(queue_critical.queue);
  const queueRateLimit = await MQ.channel.assertQueue(queue_rate_limit.queue);

  MQ.channel.bindQueue(queueCritical.queue, queue_critical.exchange, queue_critical.routing_key);
  MQ.channel.bindQueue(queueRateLimit.queue, queue_rate_limit.exchange, queue_rate_limit.routing_key);

  MQ.channel.consume(
    queueCritical.queue,
    msg => {
      console.log('critical message received')
      MQ.channel.ack(msg);
      const recievedMsg = msg.content.toString();
      console.log(`${queue_critical.queue} : ${recievedMsg}`);
      handleCriticalMessage(recievedMsg);
    }
  )

  MQ.channel.consume(
    queueRateLimit.queue,
    msg => {
      console.log('ratelimit message received')
      MQ.channel.ack(msg);
      const recievedMsg = msg.content.toString();
      console.log(`${queue_rate_limit.queue} : ${recievedMsg}`);
      handleRateLimitMessage(recievedMsg);
    }
  )


  return Promise.resolve('amq event handlers defined');
}

function handleCriticalMessage(message) {
  console.log(`sending mail to API team.... ${message}`);
}

function handleRateLimitMessage(message) {
  console.log(`sending mail to SECURITY team... ${message}`);
}

module.exports = {
  initMQ,
  MQ,
};
