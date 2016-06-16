import Promise from 'bluebird';
import R from 'ramda';
import http from './http';




/**
 * https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder
 */
const listFolder = (post, path = '', options = {}) => {
  path = path === '/' ? '' : path;
  const DEFAULTS = {
    path,
    recursive: true,
    include_media_info: false,
    include_deleted: false,
    include_has_explicit_shared_members: true,
  };
  options = R.merge(DEFAULTS, options);
  const URL = 'https://api.dropboxapi.com/2/files/list_folder';
  return post(URL, options, { silent: options.silent })
    .then(result => {
      const { entries } = result.body;
      result.files = entries.filter(item => item['.tag'] === 'file');
      result.folders = entries.filter(item => item['.tag'] === 'folder');
      return result;
    });
};




/**
 * https://www.dropbox.com/developers/documentation/http/documentation#files-download
 */
const download = (post, path, options = {}) => {
  options = R.merge(options, {
    headers: {
      'Dropbox-API-Arg': JSON.stringify({ path }),
    },
  });
  const URL = 'https://content.dropboxapi.com/2/files/download';
  return post(URL, undefined, options);
};




/**
 * Downloads a set of files.
 *
 * @param {Function} post: The POST helpers.
 * @param {Array} paths: The array of file paths.
 * @param {Object} options
 *
 * @return {Promise}.
 */
const downloadFiles = (post, paths, options) => Promise
  .all(paths.map(path => download(post, path, options)))
  .then(result => {
    const files = result.map(item => {
      const file = JSON.parse(item.headers['dropbox-api-result']);
      file.data = item.body;
      return file;
    });
    return { files };
  });




/**
 * Downloads all files within a folder.
 *
 * @param {Function} post: The POST helpers.
 * @param {Array} path: The array to the folder.
 * @param {Object} options
 *
 * @return {Promise}.
 */
const downloadFolder = (post, path, options) => (async () => {
  const folder = await listFolder(post, path);
  const paths = folder.files.map(item => item.path_display);
  return downloadFiles(post, paths, options);
})();





/**
 * Returns an HTTP API that can talk to Dropbox with the given
 * authentication token.
 *
 * @param {String} token: The auth token from dropbox.
 *
 * @return {Object}.
 */
export default (token) => {
  const post = (path, body, options) => http(token)
    .post(path, body, options)
    .then(result => {
      const isSuccess = result.status.toString().startsWith('2');
      if (isSuccess) {
        return result; // Success.
      }
      // Error: Not a 200.
      const err = new Error(`${ result.status } ${ result.message }. ${ path }`);
      err.status = result.status;
      err.headers = result.headers;
      throw err;
    });

  return {
    listFolder: (path, options) => listFolder(post, path, options),
    download: (path, options) => download(post, path, options),
    downloadFiles: (paths, options) => downloadFiles(post, paths, options),
    downloadFolder: (path, options) => downloadFolder(post, path, options),
  };
};
