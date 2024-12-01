import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Web3Context } from "../App";

function Navbar() {
  const { contract } = useContext(Web3Context);
  const [endDate, setEndDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchEndDate = async () => {
      if (contract) {
        try {
          const result = await contract.methods.getStartEndTime().call();
          const endTime = Number(result[1]); // Assuming the end time is the second value
          setEndDate(new Date(endTime * 1000)); // Convert to milliseconds
        } catch (error) {
          console.error("Error fetching end date:", error);
        }
      }
    };

    fetchEndDate();
  }, [contract]);

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

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

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
            <span className="navbar-text">
              {timeLeft && `Time left: ${timeLeft}`}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
