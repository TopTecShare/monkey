import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useState, useEffect } from "react";

import {
  NotificationManager,
  // NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import { connectWallet, getCurrentWalletConnected } from "./utils/interact.js";

import { ethers } from "ethers";
import { chainId, contractAddress } from "./constants/address";

const Dashboard = () => {
  const [mintCount, setMintCount] = useState(0);
  const [mint, setMint] = useState(1);
  const [price, setPrice] = useState(NaN);
  const [timeCount, setTimeCount] = useState(600);
  const [minute, setMinute] = useState(10);
  const [second, setSecond] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [initialIds, setInitialIds] = useState([]);
  const [newMint, setNewMint] = useState([]);
  const [contract, setContract] = useState([]);
  const totalSold = 5200;

  function setInit() {
    setIsActive(true);
    const contract = getContractWithoutSigner();
    contract.dutchAuctionConfig().then((e) => {
      setTimeCount(
        Math.floor(600 - ((Date.now() / 1000 - Number(e.startPoint)) % 600))
      );
    });
    contract.totalSold().then(Number).then(setMintCount);
    contract
      .cost(1)
      .then(Number)
      .catch(() => setIsActive(false))
      .then(setPrice);
  }

  function addWalletListener() {
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
      });
      setInit();
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
  }

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);
    setMintCount(0);

    // const initIds = generateInitIds();
    // setInitialIds(initIds);

    addWalletListener();
    window.addEventListener("focus", setInit);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (timeCount < 1) {
          setInit();
        } else {
          setTimeCount(timeCount - 1);
        }
        setSecond(timeCount % 60);
        setMinute(Math.floor(timeCount / 60));
      }, 1000);
    } else if (!isActive && timeCount !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeCount, isActive]);

  const changeMint = (e) => {
    let value = e.target.value;
    setMint(value);
  };

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    setInit();
  };

  // Contract can be used to write Contract
  const getContractWithSigner = () => {
    const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = infuraProvider.getSigner();

    const contractABI = require("./constants/contract-abi.json");
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;
  };

  // Contract can be used to read Contract
  const getContractWithoutSigner = () => {
    const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);

    const contractABI = require("./constants/contract-abi.json");
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      infuraProvider
    );

    return contract;
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractABI = require("./constants/contract-abi.json");
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  };

  const generateInitIds = () => {
    let initIds = [];

    for (let i = 0; i < 2500; i++) {
      initIds.push(i + 1);
    }

    return initIds;
  };

  const getOccupiedIds = async () => {
    try {
      const contract = getContractWithoutSigner();

      let occupiedList = await contract.occupiedList();

      return occupiedList;
    } catch (err) {
      return 0;
    }
  };

  const getDiffArray = (source, target) => {
    return source.filter((index) => {
      let tempArray = [];
      for (let i = 0; i < target.length; i++) {
        tempArray.push(ethers.BigNumber.from(target[i]).toNumber());
      }

      return tempArray.indexOf(index) < 0;
    });
  };

  const getRandomIds = async () => {
    let customIds = [];
    const occupied = await getOccupiedIds();

    console.log(initialIds);
    console.log(occupied);
    const diffIds = getDiffArray(initialIds, occupied);

    while (customIds.length < mintCount) {
      const id = Math.floor(Math.random() * diffIds.length);
      const index = diffIds[id];
      customIds.push(index);
    }

    return customIds;
  };

  const onMintPressed = async () => {
    if (!walletAddress) {
      setStatus("Please connect with Metamask");
      return;
    }

    if (mintCount < 1) {
      setStatus("Mint amount can't be less than 0");
      return;
    }

    if (mintCount > 10) {
      setStatus("Mint amount can't be greater than 10");
      return;
    }

    setMintLoading(true);

    const contract = getContractWithSigner();
    const contractR = getContractWithoutSigner();

    try {
      // let randomIds = await getRandomIds();

      // let tx = await contract.mintToken(numberOfCETS, { value: BigNumber.from(1e9).mul(BigNumber.from(1e9)).mul(6).div(100).mul(numberOfCETS), from: walletAddress })

      const price = contractR.cost(1); //250000000000000000; // 0.08 eth
      console.log(price);
      let tx = await contract.buy({
        value: price,
        from: walletAddress,
      });

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
    <div className="dashboard">
      <Container>
        <Row>
          <Col lg="7" md="12" sm="12" xs="12">
            <div className="moon">
              <h1>
                <span className="gradient-text">Mooning Monkey</span>
                <br />
                <span className="gradient-text">Doutch Auction</span>{" "}
              </h1>
              <ul>
                <li>
                  <span className="fixed-text">Starting Price</span>
                  <span className="white-text"> = 1.5 ETH</span>
                </li>
                <li>
                  <span className="fixed-text">Price drops by</span>
                  <span className="white-text">
                    {" "}
                    = 0.05 ETH until sold out or reaches 0.15ETH floor
                  </span>
                </li>
                <li>
                  <span className="fixed-text">Price Drop Frequency</span>
                  <span className="white-text"> = 10 min</span>
                </li>
                <li>
                  <span className="fixed-text">Time to reach floor</span>
                  <span className="white-text">
                    {" "}
                    = 10 min x 27 price drops = 270 min = 4h30min
                  </span>
                </li>
                <li>
                  <span className="fixed-text">Max Mint Quantity</span>
                  <span className="white-text">
                    {" "}
                    = 1 per wallet for first 4h. Then unlimited starting 11pm
                    UTC
                  </span>
                </li>
                <li>
                  <span className="fixed-text">End Time</span>
                  <span className="white-text"> = 24h</span>
                </li>
              </ul>
              <p className="fixed-text">IMPORTANT</p>
              <ul>
                <li>
                  <span className="white-text">
                    Dutch auction has been chosen to protect you from gas wars
                  </span>
                </li>
                <li>
                  <span className="white-text">
                    Reminder to have more ETH to cover gas fees
                  </span>
                </li>
              </ul>
              <div className="drop">
                <p className="gradient-text">NEXT PRICE DROP: </p>
                <h1 className="white-text">
                  {minute}:{second}
                </h1>
              </div>
            </div>
          </Col>
          <Col lg="5" md="12" sm="12" xs="12">
            <div className="avatar">
              <div className="monkey">
                <div className="monkey-image">
                  <img src={require("./assets/img/monkey.png").default} />
                </div>
                <div className="caption">
                  <p className="title">TOTAL PRICE</p>
                  <p className="sub-title">
                    {isNaN(price) ? 0 : price / 10 ** 18} ETH
                  </p>
                </div>
              </div>
              <div className="info">
                <div className="mb-3">
                  <div className="form-control">
                    <span className="result">MINT</span>
                    <div className="select">
                      <span>{mint}</span>
                      <Form.Select
                        aria-label="Default select example"
                        value={mint}
                        onChange={changeMint}
                      >
                        <option>1 max</option>
                        <option value="5">5 max</option>
                        <option value="8">8 max</option>
                        <option value="10">10 max</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-control">
                    <span className="result">TOTAL</span>
                    <div className="select">
                      <span>{mint}ETH</span>
                      <Form.Select aria-label="Default select example">
                        <option>ETH</option>
                        <option value="1">SOL</option>
                        <option value="2">BSC</option>
                        <option value="3">Cardano</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
                {walletAddress.length > 0 ? (
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={onMintPressed}
                    disabled={
                      mintLoading || isNaN(price) || mintCount >= totalSold
                    }
                  >
                    Mint Now
                  </Button>
                ) : (
                  <Button variant="primary" onClick={connectWalletPressed}>
                    <span>CONNECT WALLET</span>
                  </Button>
                )}
                <ProgressBar now={(mintCount / totalSold) * 100} />
                <p className="progress-state">
                  {mintCount} / {totalSold} MINTED
                </p>
              </div>
            </div>
          </Col>
          <Col lg="3"></Col>
          <Col lg="6" md="12" sm="12" xs="12" className="dutch">
            <h3>What is a Dutch auction ?</h3>
            <p>
              A Dutch auction is like an English auction, except that prices
              start high and are successively dropped until a bidder the going
              price, and the auction ends
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
