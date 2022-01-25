const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const web3 = require("web3");

//  NOTE : keccak256 does not give accurate result for combination of
//         two or more parameters use web3.utils.soliditySha3 instead

let freeClaimAddress = [
  [4, "0xFA712797426713758253394f7aaabeaAFC94C536"],
  [1, "0xC903C7719FCa7c353920FC3965f09d09a8222E2D"],
  [3, "0x743FC6C79929B3734568E0002Bc4A856A2f5bE82"],
  [9, "0x3BFC01Ef045BB5b30919569080c972e67DDE80b9"],
  [7, "0x6bAbf320699102104D35b540BA838732213b68C8"],
  [10, "0x8Fa8D87C6A85bb94C8473f7E54f9e14d54DF5e2e"],
];
const leafNodesFreeClaim = freeClaimAddress.map((_) =>
  web3.utils.soliditySha3(_[0], _[1])
);
const merkleTreeFreeClaim = new MerkleTree(leafNodesFreeClaim, keccak256, {
  sortPairs: true,
});

// console.log("root", merkleTreeFreeClaim.getRoot().toString("hex"));
// console.log('combine hash' ,web3.utils.soliditySha3(4,'0x351876Fa509E2b7E0ffdE254e048e39140028Af9').toString('hex'));

function getFreeClaimCount(addressToCheck) {
  for (let i of freeClaimAddress) {
    if (i[1].toUpperCase() === addressToCheck.toUpperCase()) return i[0];
    // console.log(i, addressToCheck);
  }
  return 0;
}

function getFreeClaimHexProofFromAddrs(count, addressToCheck) {
  const addressHash = web3.utils.soliditySha3(count, addressToCheck);
  const hexProof = merkleTreeFreeClaim.getHexProof(addressHash);

  return hexProof;
}

let whitelistAddress = [
  "0xFA712797426713758253394f7aaabeaAFC94C536",
  "0xC903C7719FCa7c353920FC3965f09d09a8222E2D",
  "0x743FC6C79929B3734568E0002Bc4A856A2f5bE82",
  "0x3BFC01Ef045BB5b30919569080c972e67DDE80b9",
  "0x6bAbf320699102104D35b540BA838732213b68C8",
  "0x8Fa8D87C6A85bb94C8473f7E54f9e14d54DF5e2e",
];

const leafNodesWhitelist = whitelistAddress.map(keccak256);
const merkleTreeWhiteList = new MerkleTree(leafNodesWhitelist, keccak256, {
  sortPairs: true,
});
// console.log(merkleTreeWhiteList.getRoot().toString("hex"));

function getWhitelistHexProofFromAddrs(addressToCheck) {
  const addressHash = keccak256(addressToCheck);
  const hexProof = merkleTreeWhiteList.getHexProof(addressHash);

  return hexProof;
}

module.exports = {
  getFreeClaimHexProofFromAddrs,
  getWhitelistHexProofFromAddrs,
  getFreeClaimCount,
};
