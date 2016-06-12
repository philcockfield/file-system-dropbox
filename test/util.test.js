import { expect } from 'chai';
import * as util from '../src/util';
import { http, log } from '../src/util';

describe('util.log', () => {
  it('has a log methods', () => {
    expect(util.log.silent).to.equal(false);
    expect(log.info).to.be.an.instanceof(Function);
    expect(log.warn).to.be.an.instanceof(Function);
    expect(log.error).to.be.an.instanceof(Function);
  });
});



describe('util.http', function() {
  it('is exposed off the util object', () => {
    expect(util.http).to.be.an.instanceof(Object);
  });

  it('stores the auth token', () => {
    expect(http(123).token).to.equal(123);
  });

  it('has a `post` method', () => {
    expect(http(123).post).to.be.an.instanceof(Function);
  });
});
