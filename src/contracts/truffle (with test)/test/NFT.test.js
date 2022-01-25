const { getWhitelistHexProofFromAddrs, catchRevert } = require("./utils");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const NFTContract = artifacts.require("NFTcontract");

let freeClaimAddress = [
  [4, "0xFA712797426713758253394f7aaabeaAFC94C536"],
  [1, "0xC903C7719FCa7c353920FC3965f09d09a8222E2D"],
  [3, "0x743FC6C79929B3734568E0002Bc4A856A2f5bE82"],
  [9, "0x3BFC01Ef045BB5b30919569080c972e67DDE80b9"],
  [7, "0x6bAbf320699102104D35b540BA838732213b68C8"],
];
const leafNodesFreeClaim = freeClaimAddress.map((_) =>
  web3.utils.soliditySha3(_[0], _[1])
);
const merkleTreeFreeClaim = new MerkleTree(leafNodesFreeClaim, keccak256, {
  sortPairs: true,
});

// console.log("root", merkleTreeFreeClaim.getRoot().toString("hex"));
// console.log('combine hash' ,web3.utils.soliditySha3(4,'0x351876Fa509E2b7E0ffdE254e048e39140028Af9').toString('hex'));

function freeClaimHexProof(count, addressToCheck) {
  const addressHash = web3.utils.soliditySha3(count, addressToCheck);
  const hexProof = merkleTreeFreeClaim.getHexProof(addressHash);

  return hexProof;
}

contract("NFTcontract", (accounts) => {
  describe("Main NFT contract tests", async () => {
    let bob, alice, steve, nftContractInstance;

    beforeEach(async () => {
      nftContractInstance = await NFTContract.deployed();

      bob = accounts[0];
      alice = accounts[1];
      steve = accounts[2];
    });

    /// Pre Whitelist Mint tests
    it("Pre Whitelist minting checks", async () => {
      /// Whitelist not live, expected to fail
      await catchRevert(
        nftContractInstance.whitelistMint(
          5, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Not Live"
      );

      /// Enable whitelist with non owner account
      await catchRevert(
        nftContractInstance.toggleWhitelist({ from: alice }),
        "Ownable: caller is not the owner"
      );

      /// Enable whitelist
      const tx = await nftContractInstance.toggleWhitelist({ from: bob });
      assert(tx.logs[0].args.live, "Whitelist not live");

      /// Whitelist cannot exceed 10 count
      await catchRevert(
        nftContractInstance.whitelistMint(
          15, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Max Mint"
      );
    });

    /// Minting checks
    it("Whitelist minting checks", async () => {
      /// Incorrect Eth
      await catchRevert(
        nftContractInstance.whitelistMint(
          10, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Incorrect Eth"
      );

      await catchRevert(
        nftContractInstance.whitelistMint(
          10, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          {
            from: bob, // msg.sender
            value: web3.utils.toWei("0.06", "ether"), // eth value
          }
        ),
        "Incorrect Eth"
      );

      const totalSupplyBefore = await nftContractInstance.totalSupply({
        from: alice,
      });
      const tx = await nftContractInstance.whitelistMint(
        5, // count
        getWhitelistHexProofFromAddrs(bob), // hex proof
        {
          from: bob, // msg.sender
          value: web3.utils.toWei("0.35", "ether"), // (0.07*5) eth value
        }
      );
      const totalSupplyAfter = await nftContractInstance.totalSupply({
        from: alice,
      });
      const firstLog = tx.logs[0].args;

      assert(
        totalSupplyAfter.sub(totalSupplyBefore).toString() === "5",
        "5 not minted"
      );
      assert(firstLog.tokenId.toString() === "0", "1st TokenId matches");
      assert(firstLog.to.toString() === bob, "1st TokenId wrong owner");

      /// Wrong hex proof
      await catchRevert(
        nftContractInstance.whitelistMint(
          10, // count
          getWhitelistHexProofFromAddrs(alice), // hex proof
          {
            from: bob, // msg.sender
            value: web3.utils.toWei("0.06", "ether"), // eth value
          }
        ),
        "Invalid"
      );

      /// Wrong msg.sender
      await catchRevert(
        nftContractInstance.whitelistMint(
          10, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          {
            from: alice, // msg.sender
            value: web3.utils.toWei("0.06", "ether"), // eth value
          }
        ),
        "Invalid"
      );

      /// Wrong msg.sender and hex proof
      await catchRevert(
        nftContractInstance.whitelistMint(
          10, // count
          getWhitelistHexProofFromAddrs(alice), // hex proof
          {
            from: alice, // msg.sender
            value: web3.utils.toWei("0.06", "ether"), // eth value
          }
        ),
        "Invalid"
      );

      /// Exceed max count of 10
      await catchRevert(
        nftContractInstance.whitelistMint(
          6, // count
          getWhitelistHexProofFromAddrs(bob), // hex proof
          {
            from: bob, // msg.sender
            value: web3.utils.toWei("0.42", "ether"), // (6*0.07) eth value
          }
        ),
        "Max Mint"
      );

      /// But can mint the rest 5
      let currentTokenCount = (
        await nftContractInstance.totalSupply({ from: alice })
      ).toNumber();
      const tx2 = await nftContractInstance.whitelistMint(
        5, // count
        getWhitelistHexProofFromAddrs(bob), // hex proof
        {
          from: bob, // msg.sender
          value: web3.utils.toWei("0.35", "ether"), // (0.07*5) eth value
        }
      );

      [
        tx2.logs[0].args,
        tx2.logs[1].args,
        tx2.logs[2].args,
        tx2.logs[3].args,
        tx2.logs[4].args,
      ].map((_) => {
        assert(_.tokenId.toNumber() === currentTokenCount++, "invalid tokenId");
        assert(_.to.toString() === bob, "invalid owner");
      });
    });

    /// Mass Minting Checks
    it("Mass minting checks", async () => {
      /// Wrong count
      await catchRevert(
        nftContractInstance.massMint(
          [1, 1], // count[]
          [bob, alice, steve], // address[]
          {
            from: bob, // msg.sender
          }
        ),
        "Incorrect parameters"
      );

      /// Wrong address
      await catchRevert(
        nftContractInstance.massMint(
          [1, 1, 1, 1], // count[]
          [bob, alice, steve], // address[]
          {
            from: bob, // msg.sender
          }
        ),
        "Incorrect parameters"
      );

      /// Wrong sender
      await catchRevert(
        nftContractInstance.massMint(
          [1, 1, 1], // count[]
          [bob, alice, steve], // address[]
          {
            from: alice, // msg.sender
          }
        ),
        "Ownable: caller is not the owner"
      );

      /// count > supply
      await catchRevert(
        nftContractInstance.massMint(
          [50, 15, 40], // count[]
          [bob, alice, steve], // address[]
          {
            from: bob, // msg.sender
          }
        ),
        "Not enough Mints available"
      );

      const balanceBefore = await web3.eth.getBalance(bob);
      const totalSupplyBefore = (
        await nftContractInstance.totalSupply()
      ).toNumber();

      const tx = await nftContractInstance.massMint(
        [3, 1, 20],
        [bob, alice, steve],
        { from: bob }
      );
      const balanceAfter = await web3.eth.getBalance(bob);
      const totalSupplyAfter = (
        await nftContractInstance.totalSupply()
      ).toNumber();
      let currentTokenId = totalSupplyBefore;

      assert(tx.logs[0].args.to === bob, "Incorrect address");
      assert(
        tx.logs[0].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(tx.logs[1].args.to === bob, "Incorrect address");
      assert(
        tx.logs[1].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(tx.logs[2].args.to === bob, "Incorrect address");
      assert(
        tx.logs[2].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(tx.logs[3].args.to === alice, "Incorrect address");
      assert(
        tx.logs[3].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(tx.logs[4].args.to === steve, "Incorrect address");
      assert(
        tx.logs[4].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(tx.logs[5].args.to === steve, "Incorrect address");
      assert(
        tx.logs[5].args.tokenId.toNumber() === currentTokenId,
        "Incorrect tokenId"
      );
      currentTokenId++;

      assert(
        totalSupplyAfter - totalSupplyBefore === 3 + 1 + 20,
        "Wrong token no. minted"
      );
    });

    /// Free claim checks
    it("Free Claim checks", async () => {
      /// Free claim not live, expected to fail
      await catchRevert(
        nftContractInstance.claim(
          5, // count
          freeClaimHexProof(4, bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Not Live"
      );

      /// Enable fee claim with non owner account
      await catchRevert(
        nftContractInstance.toggleFreeClaim({ from: alice }),
        "Ownable: caller is not the owner"
      );

      /// Enable free claim
      const txClaimToggle = await nftContractInstance.toggleFreeClaim({
        from: bob,
      });
      assert(txClaimToggle.logs[0].args.live, "Free claim not live");

      /// Free claim wrong count
      await catchRevert(
        nftContractInstance.claim(
          10, // count
          freeClaimHexProof(4, bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Invalid"
      );

      /// Free claim
      let currentTokenId = (await nftContractInstance.totalSupply()).toNumber();
      const tx = await nftContractInstance.claim(
        4, // count
        freeClaimHexProof(4, bob), // hex proof
        { from: bob } // msg.sender
      );

      const firstClaim = tx.logs[0].args;
      assert(firstClaim.to === bob, "Invalid address");
      assert(
        firstClaim.tokenId.toNumber() === currentTokenId,
        "Invalid tokenId"
      );
      currentTokenId++;

      const secondClaim = tx.logs[1].args;
      assert(secondClaim.to === bob, "Invalid address");
      assert(
        secondClaim.tokenId.toNumber() === currentTokenId,
        "Invalid tokenId"
      );
      currentTokenId++;

      const thirdClaim = tx.logs[2].args;
      assert(thirdClaim.to === bob, "Invalid address");
      assert(
        thirdClaim.tokenId.toNumber() === currentTokenId,
        "Invalid tokenId"
      );
      currentTokenId++;

      const lastClaim = tx.logs[3].args;
      assert(lastClaim.to === bob, "Invalid address");
      assert(
        lastClaim.tokenId.toNumber() === currentTokenId,
        "Invalid tokenId"
      );

      /// Already claimed
      await catchRevert(
        nftContractInstance.claim(
          4, // count
          freeClaimHexProof(4, bob), // hex proof
          { from: bob } // msg.sender
        ),
        "Already claimed"
      );
    });
  });

  describe("Dutch Auction tests", async () => {
    let bob, alice, steve, nftContractInstance;

    beforeEach(async () => {
      nftContractInstance = await NFTContract.deployed();

      bob = accounts[0];
      alice = accounts[1];
      steve = accounts[2];
    });

    it("DutchAuction Checks", async () => {
      await nftContractInstance.setAuctionStartPoint(
        parseInt(Date.now() / 1000)
      );
      const cost = await nftContractInstance.cost(1);

      /// Mint more than permissible
      await catchRevert(
        nftContractInstance.buy({
          from: alice,
          value: web3.utils.toWei("0.5", "ether").toString(),
        }),
        "Seller: Costs 1500000000 GWei"
      );

      /// Mint one token
      const totalSupply = (await nftContractInstance.totalSupply()).toNumber();
      const tx = await nftContractInstance.buy({
        from: steve,
        value: web3.utils.toWei("1.5", "ether").toString(),
      });

      const buyLog = tx.logs[0].args;
      assert(buyLog.to === steve, "Wrong Address");
      assert(buyLog.tokenId.toNumber() === totalSupply, "Wrong tokenId");

      /// More than 1 buy
      catchRevert(
        nftContractInstance.buy({
          from: steve,
          value: web3.utils.toWei("1.5", "ether").toString(),
        }),
        "Seller: Buyer limit"
      );
    });
  });
});
