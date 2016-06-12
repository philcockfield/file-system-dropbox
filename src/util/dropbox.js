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
  return post(URL, options, { silent: options.silent });
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
 * Returns an HTTP API that can talk to Dropbox with the given
 * authentication token.
 *
 * @param {String} token: The auth token from dropbox.
 *
 * @return {Object}.
 */
export default (token) => {
  const { post } = http(token);
  return {
    listFolder: (path, options) => listFolder(post, path, options),
    download: (path, options) => download(post, path, options),
  };
};
