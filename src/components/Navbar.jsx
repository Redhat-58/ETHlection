import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Web3Context } from "../App";

function Navbar() {
  const { web3, contract, contractAddr } = useContext(Web3Context);
  const [balance, setBalance] = useState("0.000");

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (contract) {
        try {
          const balanceWei = await web3.eth.getBalance(contractAddr);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(Number(balanceEth).toPrecision(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div className="container-fluid">
          <NavLink
            className="navbar-brand d-flex align-items-center gap-2"
            to="/candidates"
          >
            <img src="logo.png" alt="Logo" width="40" height="40" />
            ETHlection
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-3">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link bg-dark text-white" : "nav-link"
                  }
                  to="/candidates"
                >
                  Candidates
                </NavLink>
              </li>
              <div className="vr"></div>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link bg-dark text-white" : "nav-link"
                  }
                  to="/cusis"
                >
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
