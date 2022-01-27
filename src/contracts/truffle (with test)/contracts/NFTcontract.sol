//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@divergencetech/ethier/contracts/sales/LinearDutchAuction.sol";

import "./utils/BaseERC721.sol";
import "./utils/Merkle.sol";

contract NFTContract is
    ReentrancyGuard,
    BaseERC721,
    Merkle,
    LinearDutchAuction
{
    bool public isFreeClaimActive;
    mapping(address => uint256) internal whitelistCount;
    bool public isWhitelistActive;
    mapping(address => uint256) public totalClaimed;

    event Claimed(uint256 count, address sender);
    event WhitelistActive(bool live);
    event FreeClaimActive(bool live);

    constructor(
        bytes32 _whitelistRoot,
        bytes32 _freeClaimRoot,
        uint256 _supply,
        uint256 _max
    )
        Merkle(_whitelistRoot, _freeClaimRoot)
        BaseERC721(
            _supply,
            _max,
            0.07 ether,
            "https://ipfs.io/ipfs/QmeHzogTxMk27xDARdPJfQMqNF1xyUt4oECNSrCQfpwCH8/",
            "NFTContract",
            "NFTC"
        )
        LinearDutchAuction(
            LinearDutchAuction.DutchAuctionConfig({
                startPoint: 0, // disabled at deployment
                startPrice: 1.5 ether,
                unit: AuctionIntervalUnit.Time,
                decreaseInterval: 600, // 10 minutes
                decreaseSize: 0.05 ether,
                numDecreases: 27
            }),
            0.15 ether,
            Seller.SellerConfig({
                totalInventory: 5200,
                lockTotalInventory: true,
                maxPerAddress: 12,
                maxPerTx: 12,
                freeQuota: 0,
                lockFreeQuota: true,
                reserveFreeQuota: true
            }),
            payable(msg.sender) // beneficiary
        )
    {}

    function claim(uint256 count, bytes32[] calldata proof)
        external
        payable
        nonReentrant
    {
        require(isFreeClaimActive, "Not Live");
        require(_claimVerify(_claimLeaf(msg.sender, count), proof), "Invalid");
        require(totalClaimed[msg.sender] != count, "Already claimed");

        uint256 current = totalSupply();
        require(current + count <= supply, "Sold out");
        _safeMint(msg.sender, count);
        totalClaimed[msg.sender] += count;
        emit Claimed(count, msg.sender);
    }

    function whitelistMint(
        uint256 count,
        /*uint256 tokenId,*/
        bytes32[] calldata proof
    ) external payable nonReentrant {
        require(isWhitelistActive, "Not Live");
        require(
            _whitelistVerify(
                _whitelistLeaf(
                    msg.sender /*, tokenId*/
                ),
                proof
            ),
            "Invalid"
        );
        require(whitelistCount[msg.sender] + count <= 1, "Max Mint");
        _callMint(count);
        whitelistCount[msg.sender] += count;
    }

    function massMint(uint256[] memory count, address[] memory recipient)
        external
        nonReentrant
        onlyOwner
    {
        require(count.length <= 50, "List too big");
        require(count.length == recipient.length, "Incorrect parameters");
        uint256 current = totalSupply();
        uint256 countTotal;

        for (uint256 i; i < count.length; i++) {
            countTotal += count[i];
        }

        require(current + countTotal <= supply, "Not enough Mints available");
        for (uint256 j; j < count.length; j++) {
            _safeMint(recipient[j], count[j]);
        }
    }

    function viewClaimed(address account) external view returns (uint256) {
        return totalClaimed[account];
    }

    function toggleWhitelist() external onlyOwner {
        isWhitelistActive = !isWhitelistActive;
        emit WhitelistActive(isWhitelistActive);
    }

    function toggleFreeClaim() external onlyOwner {
        isFreeClaimActive = !isFreeClaimActive;
        emit FreeClaimActive(isFreeClaimActive);
    }

    /// LinearDutchAuction Required Functions
    /// @notice Entry point for purchase of a single token.
    function buy() external payable {
        Seller._purchase(msg.sender, 1);
    }

    /// @notice Internal override of Seller function for handling purchase (i.e. minting).
    function _handlePurchase(
        address to,
        uint256 num,
        bool
    ) internal override {
        _safeMint(to, num);
    }
}
