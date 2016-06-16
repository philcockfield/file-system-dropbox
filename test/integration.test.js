import Promise from 'bluebird';
import { expect } from 'chai';
import m from '../src';
import * as util from '../src/util';
import { http, dropbox } from '../src/util';


// Store a valid auth-token in your env-vars.
const TOKEN = process.env.FILE_SYSTEM_DROPBOX_TOKEN;
const api = dropbox(TOKEN);



describe.skip('connection', function() {
  this.timeout(10000);

  it('lists root folders', () => {
    return api
      .listFolder('/')
      .then(result => {
        console.log("result.body", result.body);
      });
  });


  it('downloads file', () => {
    return api
      .download('/nic/README.md')
      .then(result => {
        console.log("result", result);
      });
  });

  it.only('downloads folder', () => (async () => {


    // console.log("Downloading folder", "/");
    // console.log("");
    const result = await api.downloadFolder('/');
    // console.log("result", result);

    result.files.forEach(file => {
      console.log("file:", file.name);
      console.log(file.data);
      console.log("");
    });

  })());


});
