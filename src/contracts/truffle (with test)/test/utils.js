const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

///  NOTE : keccak256 does not give accurate result for combination of
///         two or more parameters use web3.utils.soliditySha3 instead

// let freeClaimAddress = [
//     [4, '0x351876Fa509E2b7E0ffdE254e048e39140028Af9'],
//     [1, '0x356fD453840c74BA6A2497DCD7a35c8c141bc1E1'],
//     [3, '0xAbB267696a7C7a7c7421B9218df31fE652850505'],
//     [9, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
//     [7, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4']
// ]

// const leafNodesFreeClaim = freeClaimAddress.map(_ => keccak256(_[0], _[1]));
// const merkleTreeFreeClaim = new MerkleTree(leafNodesFreeClaim, keccak256, { sortPairs: true });
// console.log((merkleTreeFreeClaim.getRoot()).toString('hex'));
// console.log(web3.utils.soliditySha3(4,'0x351876Fa509E2b7E0ffdE254e048e39140028Af9').toString('hex'));
// console.log(getFreeClaimHexProofFromAddrs(4,'0x351876Fa509E2b7E0ffdE254e048e39140028Af9'))

// function getFreeClaimHexProofFromAddrs(count, addressToCheck) {
//     const addressHash = keccak256(count, addressToCheck);
//     const hexProof = merkleTreeFreeClaim.getHexProof(addressHash);

//     return hexProof;
// }

let whitelistAddress = [
  "0xFA712797426713758253394f7aaabeaAFC94C536",
  "0xC903C7719FCa7c353920FC3965f09d09a8222E2D",
  "0x743FC6C79929B3734568E0002Bc4A856A2f5bE82",
  "0x3BFC01Ef045BB5b30919569080c972e67DDE80b9",
  "0x6bAbf320699102104D35b540BA838732213b68C8",
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

/**
 * This is try catch function for testing the Exceptions in the Contract tests
 */
async function tryCatch(promise, message) {
  // const PREFIX = "VM Exception while processing transaction: ";
  try {
    await promise;
    throw null;
  } catch (error) {
    assert(error, "Expected an error but did not get one");
    console.log(error.message);
    assert(
      error.message.includes(message),
      "Expected an error containing '" +
        message +
        "' but got '" +
        error.message +
        "' instead"
    );
  }
}

/**
 * This catches the Revert exceptions from the contract
 * @param promise
 */
async function catchRevert(promise, msg) {
  await tryCatch(promise, msg);
}

module.exports = {
  // getFreeClaimHexProofFromAddrs,
  getWhitelistHexProofFromAddrs,
  tryCatch,
  catchRevert,
};
