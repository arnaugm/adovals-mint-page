import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import whitelist from './whitelist';

const merkleTree = new MerkleTree(whitelist, keccak256, {
  sortPairs: true,
});

const getProof = (account) => merkleTree.getHexProof(keccak256(account));

export { getProof }; // eslint-disable-line import/prefer-default-export
