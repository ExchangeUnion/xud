import semver from 'semver';
import { expect } from 'chai';

describe('Semver', () => {
  it('should give 0 if first equals to second', async () => {
    expect(semver.compare('1.0.0', '1.0.0')).to.eq(0);
  });

  it('should give 0 if first equals to second with prerelease tags', async () => {
    expect(semver.compare('1.0.0-alpha.3', '1.0.0-alpha.3')).to.eq(0);
  });

  it('should give 1 if first bugfix is higher than second', async () => {
    expect(semver.compare('1.0.1', '1.0.0')).to.eq(1);
  });

  it('should give 1 if first minor is higher than second', async () => {
    expect(semver.compare('1.1.0', '1.0.0')).to.eq(1);
  });

  it('should give 1 if first major is higher than second', async () => {
    expect(semver.compare('2.0.0', '1.0.0')).to.eq(1);
  });

  it('should give 1 if first minor is higher than second with prerelease tags', async () => {
    expect(semver.compare('1.0.1-alpha.1', '1.0.0-beta.2')).to.eq(1);
  });

  it('should give 1 if first prerelease tag (alpha) is higher than second', async () => {
    expect(semver.compare('1.0.0-alpha.3', '1.0.0-alpha.2')).to.eq(1);
  });

  it('should give 1 if first prerelease tag (beta) is higher than second', async () => {
    expect(semver.compare('1.0.0-beta.1', '1.0.0-alpha.2')).to.eq(1);
  });

  it('should give 1 if first prerelease tag (rc) is higher than second', async () => {
    expect(semver.compare('1.0.0-rc.1', '1.0.0-beta.2')).to.eq(1);
  });

  it('should give -1 if first bugfix is lower than second', async () => {
    expect(semver.compare('1.0.0', '1.0.1')).to.eq(-1);
  });

  it('should give -1 if first minor is lower than second', async () => {
    expect(semver.compare('1.0.0', '1.1.0')).to.eq(-1);
  });

  it('should give -1 if first major is lower than second', async () => {
    expect(semver.compare('1.0.0', '2.0.0')).to.eq(-1);
  });

  it('should give -1 if first minor is lower than second with prerelease tags', async () => {
    expect(semver.compare('1.0.0-beta.2', '1.0.1-alpha.1')).to.eq(-1);
  });

  it('should give -1 if first prerelease tag (alpha) is lower than second', async () => {
    expect(semver.compare('1.0.0-alpha.2', '1.0.0-alpha.3')).to.eq(-1);
  });

  it('should give -1 if first prerelease tag (beta) is lower than second', async () => {
    expect(semver.compare('1.0.0-alpha.2', '1.0.0-beta.1')).to.eq(-1);
  });

  it('should give -1 if first prerelease tag (rc) is lower than second', async () => {
    expect(semver.compare('1.0.0-beta.2', '1.0.0-rc.1')).to.eq(-1);
  });

  it('should throw error for non-semantic first', async () => {
    expect(semver.compare.bind(undefined, '1.0.0.beta.2', '1.0.0-rc.1')).to.throw('Invalid Version: 1.0.0.beta.2');
  });

  it('should throw error for non-semantic second', async () => {
    expect(semver.compare.bind(undefined, '1.0.0-beta.2', '1._3')).to.throw('Invalid Version: 1._3');
  });
});
