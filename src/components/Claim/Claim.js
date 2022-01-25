import React, { useState } from "react";

export default function Claim() {
  const [key, setKey] = useState("home");
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
                  <a className="btn btn-dark" href="#">
                    CONNECT To WALLET
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
