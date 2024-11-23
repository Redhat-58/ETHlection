import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Web3Context } from "../App";

function Navbar() {
  const { web3 } = useContext(Web3Context);
  const [balance, setBalance] = useState("0.0000");
  const contractAddr = "0xf9E2e95C2c98c663f4709243ca12eD56C11C6F16";

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (web3) {
        try {
          const balance = web3.utils.fromWei(
            web3.eth.getBalance(contractAddr),
            "ether"
          );
          setBalance(Number(balance).toPrecision(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();

    // Refresh balance every second
    const interval = setInterval(() => {
      fetchBalance();
    }, 1000);

    return () => clearInterval(interval);
  }, [web3, contractAddr]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/candidates">
            <img src="logo.png" alt="Logo" width="40" height="40" />
            ETHlection
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav nav-pills mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/candidates">
                  Candidates
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cusis">
                  CUSIS
                </NavLink>
              </li>
            </ul>
            <span className="navbar-text">Contract Balance: {balance} ETH</span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
