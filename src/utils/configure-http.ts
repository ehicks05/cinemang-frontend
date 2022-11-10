import axios from 'axios';
import { createHttpAgent, createHttpsAgent } from './create-http-agents';

export function configureHttp(): void {
  axios.defaults.httpAgent = createHttpAgent();
  axios.defaults.httpsAgent = createHttpsAgent();
}
