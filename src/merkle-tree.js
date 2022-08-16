import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import allowlist from './allowlist';

const merkleTree = new MerkleTree(allowlist, keccak256, {
  sortPairs: true,
});

const getProof = (account) => merkleTree.getHexProof(keccak256(account));

const isAllowlisted = (account) => {
  const accountHash = `0x${keccak256(account).toString('hex')}`;
  return allowlist.includes(accountHash);
};

export { getProof, isAllowlisted };
