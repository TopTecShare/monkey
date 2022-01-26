import React from "react";
import { useState, useEffect } from "react";
import {
  NotificationManager,
  // NotificationContainer,
} from "react-notifications";
import { Button } from "react-bootstrap";
import {
  connectWallet,
  getCurrentWalletConnected,
} from "../../utils/interact.js";

import {
  getFreeClaimHexProofFromAddrs,
  getFreeClaimCount,
} from "../../utils/util.js";

import { ethers } from "ethers";
import { chainId, contractAddress } from "../../constants/address";

export default function Claim() {
  const [mintCount, setMintCount] = useState(0);
  const [walletAddress, setWallet] = useState("");
  const [, setStatus] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const totalSupply = 12000;

  // Contract can be used to write Contract
  const getContractWithSigner = () => {
    const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = infuraProvider.getSigner();

    const contractABI = require("../../constants/contract-abi.json");
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;
  };

  // Contract can be used to read Contract
  const getContractWithoutSigner = () => {
    const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);

    const contractABI = require("../../constants/contract-abi.json");
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      infuraProvider
    );

    return contract;
  };

  useEffect(() => {
    const addWalletListener = () => {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            setStatus("👆🏽 You can mint new pack now.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the Connect button.");
          }
        });
        window.ethereum.on("chainChanged", (chain) => {
          connectWalletPressed();
          if (chain !== chainId) {
          }
          window.location.reload(false);
        });
      } else {
        setStatus(
          <p>
            {" "}
            🦊{" "}
            {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.(https://metamask.io/download.html)
            {/* </a> */}
          </p>
        );
      }
    };

    const myFunc = async () => {
      const { address, status } = await getCurrentWalletConnected();

      setWallet(address);
      setStatus(status);

      if (address !== "") {
        const contract = getContractWithoutSigner();
        contract.totalSupply().then(setMintCount);
        contract.on("Transfer", (from, to, index) => {
          contract.totalSupply().then(setMintCount);
        });
      }

      addWalletListener();
    };
    myFunc();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    if (!walletAddress) {
      setStatus("Please connect with Metamask");
      return;
    }

    setMintLoading(true);

    const contract = getContractWithSigner();

    try {
      // let randomIds = await getRandomIds();

      // let tx = await contract.mintToken(numberOfCETS, { value: BigNumber.from(1e9).mul(BigNumber.from(1e9)).mul(6).div(100).mul(numberOfCETS), from: walletAddress })
      // console.log(contract.whitelistMint)
      // console.log(getWhitelistHexProofFromAddrs(walletAddress))
      let count = getFreeClaimCount(walletAddress);
      console.log(count);
      let tx = await contract.claim(
        count,
        getFreeClaimHexProofFromAddrs(count, walletAddress),
        {
          from: walletAddress,
        }
      );

      let res = await tx.wait();
      console.log(res);
      if (res.transactionHash) {
        let status = "You minted successfully";
        setStatus(status);
        setMintLoading(false);
        NotificationManager.success(status);
      }
    } catch (err) {
      // let status = "Transaction failed because you have insufficient funds or sales not started"
      let status = "Transaction failed";
      setStatus(status);
      setMintLoading(false);
      NotificationManager.error(status);
    }
  };

  return (
    <React.Fragment>
      <div className="section whitelist">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center ">
              <h2 className="heading-big">CLAIM YOUR MOONING MONKEY NFTs</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="section comic-second comic-tab whitelist2">
        <div className="container">
          <div className="row">
            <div className="col-md-12 ">
              <div className="col-md-6 offset-3 box top-30 whitelist-cal">
                <h2 className="small-heading text-center">
                  CLAIM YOUR MOONING MONKEY NFTs BY CLICKING THE BUTTON BELOW
                </h2>

                <div className="row top-20">
                  <img
                    src={require("../Claim/img/mooning-img-rrr.png").default}
                    className="img-responsive "
                    alt="paid"
                  />
                </div>
                <div className="row top-30">
                  {walletAddress.length > 0 ? (
                    <Button
                      className="btn btn-dark"
                      variant="primary"
                      type="submit"
                      onClick={onMintPressed}
                      disabled={mintLoading || mintCount >= totalSupply}
                    >
                      Mint Now
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={connectWalletPressed}>
                      <span>CONNECT WALLET</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="col-md-6 offset-3 text-center top-50 whitelist-text">
                {" "}
                <p>
                  Important notice: make sure you have enough ETH to pay for
                  transaction gas fees.
                </p>
              </div>
            </div>
          </div>
          <div className="row top-50 partners text-center">
            <div className="col-md-12 top-50 text-center">
              <h2 className="heading ">INVESTORS</h2>
            </div>

            <div className="row col-md-10 offset-1 top-70 text-center">
              <div className="col-6  offset-3">
                <img
                  src={require("../Whitelist/img/Beast.png").default}
                  className="img-responsive width-450"
                  alt="paid"
                />
              </div>
            </div>
            <div className="row col-md-10 offset-1 top-70">
              <div className="col-6 top-20">
                <img
                  src={require("../Whitelist/img/pomp.png").default}
                  className="img-responsive "
                  alt="paid"
                />
              </div>
              <div className="col-6 ">
                <img
                  src={require("../Whitelist/img/logo-1-2.png").default}
                  className="img-responsive width-450"
                  alt="paid"
                />
              </div>
            </div>
          </div>
          <div className="row top-50 partners text-center">
            <div className="col-md-12 top-50 text-center">
              <h2 className="heading ">PARTNERS</h2>
            </div>

            <div className="row col-md-10 offset-1 top-70">
              <div className="col-6 ">
                <img
                  src={require("../Whitelist/img/paid.png").default}
                  className="img-responsive "
                  alt="paid"
                />
              </div>
              <div className="col-6 ">
                <img
                  src={require("../Whitelist/img/master.png").default}
                  className="img-responsive width-450"
                  alt="paid"
                />
              </div>
            </div>
            <div className="row col-md-10 offset-1 top-70 text-center">
              <div className="col-6  offset-3">
                <img
                  src={require("../Whitelist/img/apotte.png").default}
                  className="img-responsive width-450"
                  alt="paid"
                />
              </div>
            </div>
            <div className="row col-md-10 offset-1 top-70">
              <div className="col-6 ">
                <img
                  src={require("../Whitelist/img/latitiude.png").default}
                  className="img-responsive "
                  alt="paid"
                />
              </div>
              <div className="col-6 ">
                <img
                  src={require("../Whitelist/img/plutusvs.png").default}
                  className="img-responsive width-450"
                  alt="paid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
