import { expect } from 'chai';
import * as util from '../src/util';

describe('util', () => {
  it('has an http library', () => {
    expect(util.http.request).to.be.an.instanceof(Function);
    expect(util.http.get).to.be.an.instanceof(Function);
    expect(util.http.put).to.be.an.instanceof(Function);
    expect(util.http.post).to.be.an.instanceof(Function);
    expect(util.http.patch).to.be.an.instanceof(Function);
    expect(util.http.delete).to.be.an.instanceof(Function);
  });

  it('has a log', () => {
    expect(util.log.silent).to.equal(false);
    expect(util.log.info).to.be.an.instanceof(Function);
    expect(util.log.warn).to.be.an.instanceof(Function);
    expect(util.log.error).to.be.an.instanceof(Function);
  });
});
