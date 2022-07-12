import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import allowlist from './allowlist';

const merkleTree = new MerkleTree(allowlist, keccak256, {
  sortPairs: true,
});

const getProof = (account) => merkleTree.getHexProof(keccak256(account));

export { getProof }; // eslint-disable-line import/prefer-default-export
