import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

export default function Whitelist() {
  const [key, setKey] = useState("home");
  return (
    <React.Fragment>
      <div className="section whitelist">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center ">
              <h2 className="heading-big">
                ACCESS YOUR <br />
                WHITELIST SPOT
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="section comic-second comic-tab whitelist2">
        <div className="container">
          <div className="row">
            <div className="col-md-12 ">
              <div className="col-md-6 offset-3 box top-30 whitelist-cal">
                <h2 className="small-heading">MOONING MONKEY WHITELIST SPOT</h2>
                <p className="white-text">
                  Press the connect wallet button to claim and pay for your
                  Whitelist spot.
                </p>
                <div className="row top-30">
                  <div className="col-4">
                    <img
                      src={require("../Whitelist/img/monkey-2.png").default}
                      className="img-responsive "
                      alt="stage-1"
                    />
                  </div>
                  <div className="col-8 text-right">
                    <p className="top-20">Mooning Monkey Price</p>
                    <h4>
                      {" "}
                      <span>0.15</span> ETH
                    </h4>
                    <p>
                      <span>2’500 remaining</span>
                    </p>
                  </div>
                </div>
                <div className="row total-sec">
                  <h3>
                    1 <span>0.15 ETH max </span>
                  </h3>
                </div>
                <div className="row top-30 total-sec2">
                  <h3>
                    Total{" "}
                    <span>
                      <span className="pink">0.15</span> ETH{" "}
                    </span>
                  </h3>
                </div>
                <div className="row top-20">
                  <a className="btn btn-dark" href="#">
                    CONNECT WALLET
                  </a>
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
