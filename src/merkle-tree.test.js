import { isAllowlisted } from './merkle-tree';

const allowlist = [
  '0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0',
  '0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94',
];

jest.mock('./allowlist', () => allowlist);

describe('merkle-tree', () => {
  describe('#isAllowlisted', () => {
    test('should return true when the hash of the account is present in the list', () => {
      const account = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
      expect(isAllowlisted(account)).toBe(true);
    });

    test('should return false when the hash of the account is not present in the list', () => {
      const account = '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f';
      expect(isAllowlisted(account)).toBe(false);
    });
  });
});
