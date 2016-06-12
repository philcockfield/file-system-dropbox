import { expect } from 'chai';
import * as util from '../src/util';
import { http, dropbox } from '../src/util';


// Store a valid auth-token in your env-vars.
const TOKEN = process.env.FILE_SYSTEM_DROPBOX_TOKEN;
const api = dropbox(TOKEN);



describe('connection', function() {
  this.timeout(10000);

  it('lists root folders', () => {
    return api
      .listFolder('/')
      .then(result => {
        console.log("result.body", result.body);
      });
  });


  it('downloads files', () => {
    return api
      .download('/nic/README.md')
      .then(result => {
        console.log("result", result);
      });
  });
});
