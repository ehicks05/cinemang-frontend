import { AxiosError } from 'axios';
import { pick } from 'lodash';
import logger from '../logger';

export const logAxiosError = (error: AxiosError) => {
  const config = pick(error.config, ['baseURL', 'url', 'params']);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status, headers } = error.response;
    if (status === 404) logger.error({ status, url: config.url });
    else logger.error({ data, status, config /* headers */ });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    logger.error({ request: error.request, config });
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error({ errorMessage: error.message, config });
  }
};
