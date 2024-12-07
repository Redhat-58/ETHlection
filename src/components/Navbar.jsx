import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Web3Context } from "../App";

function Navbar() {
  const { contract, endTime } = useContext(Web3Context);
  const [endDate, setEndDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("No Ongoing Election");

  useEffect(() => {
    const fetchEndDate = async () => {
      if (contract) {
        try {
          if (!endDate) {
            const result = await contract.methods.getStartEndTime().call();
            const endTime = new Date(Number(result[1]) * 1000);
            setEndDate(new Date(endTime)); // Convert to milliseconds
          } else {
            setEndDate(new Date(Number(endTime) * 1000)); // Convert to milliseconds
          }
        } catch (error) {
          console.error("Error fetching end date:", error);
        }
      }
    };

    fetchEndDate();
  }, [endTime, contract]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (endDate) {
        const now = new Date();
        const difference = endDate - now;

        if (difference > 0) {
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft("Election ended");
        }
      }
    };

    // Update time left every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  // Navigation bar definition
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div className="container-fluid">
          <NavLink
            className="navbar-brand d-flex align-items-center gap-2"
            to="/candidates"
          >
            <img src="/ETHlection/logo.png" alt="Logo" width="40" height="40" />
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
            <span className="navbar-text">Time left: {timeLeft}</span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
