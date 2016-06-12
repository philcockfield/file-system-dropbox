import { expect } from 'chai';
import * as util from '../src/util';
import { http } from '../src/util';


// Store a valid auth-token in your env-vars.
const TOKEN = process.env.FILE_SYSTEM_DROPBOX_TOKEN;


describe('connection', function() {
  it('lists root folders', () => {

    const args = {
      path: '',
      recursive: true,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: true
    };

    return http(TOKEN).post('https://api.dropboxapi.com/2/files/list_folder', args, { silent: false })
      .then(result => {
        console.log("result.body.entries", result.body.entries);
      })
      .catch(err => {
        console.log("err", err);
      });
  });

});
