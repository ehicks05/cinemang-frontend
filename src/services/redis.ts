import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const init = async () => {
  await client.connect();
};

init();

export default client;
