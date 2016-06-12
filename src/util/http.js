import R from 'ramda';
import Promise from 'bluebird';
import log from './log';
import http from 'request';


/**
 * Makes an HTTP(S) request.
 *
 * @param {String} path: The URL path.
 * @param {Object} options:
 *                    See: https://github.com/request/request#requestoptions-callback
 *                    - silent: Suppress logging (default: true).
 *
 * @return {Promise}.
 */
const request = (options = {}) => new Promise((resolve, reject) => {
  const silent = options.silent === undefined ? true : options.silent;
  const method = options.method || 'GET';
  const uri = options.uri;

  const info = (...value) => {
    if (!silent) {
      log.info.apply(null, value);
    }
  };
  info(log.magenta(method), log.cyan(uri));

  // Turn JSON on automatically if body is an Object.
  if (options.json === undefined && R.is(Object, options.body)) {
    options.json = true;
  }

  // Start the request.
  http(options)
    .on('response', res => {
      let data = '';
      res.on('data', d => { data += d; });
      res.on('end', () => {
        const { statusCode: status, statusMessage: message, headers } = res;

        let body = data;
        if (body) {
          try {
            body = JSON.parse(body);
          } catch (err) {
            // Ignore - failed to parse response, just return the string.
          }
        }
        const result = {
          status,
          message,
          headers,
          body,
        };
        if (status.toString().startsWith('2')) {
          info(log.magenta(method), log.green(status, message), log.cyan(uri));
          resolve(result);
        } else {
          // Request was not successful.
          info(log.magenta(method), log.red(status, message), log.cyan(uri));
          resolve(result);
        }
      });
    })
    .on('error', err => reject(err));
});



const verb = (method, uri, body, options = {}) => {
  options = R.merge(options, { method, uri, body });
  return request(options);
};
const get = (uri, options) => verb('GET', uri, undefined, options);
const put = (uri, body, options) => verb('PUT', uri, body, options);
const post = (uri, body, options) => verb('POST', uri, body, options);
const patch = (uri, body, options) => verb('PATCH', uri, body, options);
const del = (uri, options) => verb('DELETE', uri, undefined, options);



// API.
export default {
  request,
  get,
  put,
  post,
  patch,
  delete: del,
};
