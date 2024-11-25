import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Candidates from "./components/Candidates";
import CUSIS from "./components/CUSIS";
import Web3 from "web3";

export const Web3Context = createContext(null);

function App() {
  const [web3, setWeb3] = useState(null);
  const [accountAddr, setAccountAddr] = useState("");
  const [contractABI, setContractABI] = useState([]);
  const [contract, setContract] = useState(null);
  const contractAddr = "0x0fd985d0b61f73dfC6AaBe7263B27eabA2b988bD"; // Last deployed contract address
  const compileData = "../contracts/Election.json"; // Path to compile data

  useEffect(() => {
    setWeb3(new Web3(import.meta.env.VITE_HOLESKY_INFURA_ENDPOINT)); // Connect to Infura endpoint

    fetch(compileData)
      .then((response) => response.json())
      .then((data) => {
        setContractABI(data.abi);
        console.log("ABI set:", data.abi);
      })
      .catch((error) => {
        console.error("Error fetching ABI:", error);
      });
  }, []);

  useEffect(() => {
    if (web3 && contractABI.length > 0 && contractAddr) {
      setContract(new web3.eth.Contract(contractABI, contractAddr));
    }
  }, [contractABI]);

  const changeWeb3 = (web3) => {
    setWeb3(web3);
  };

  const changeAccountAddr = (accountAddr) => {
    setAccountAddr(accountAddr);
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        changeWeb3,
        accountAddr,
        changeAccountAddr,
        contract,
        contractABI,
        contractAddr,
      }}
    >
      <Router>
        <div style={{ backgroundColor: "#e5e5e5", minHeight: "100vh" }}>
          <Navbar />
          <Routes>
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/cusis" element={<CUSIS />} />
          </Routes>
        </div>
      </Router>
    </Web3Context.Provider>
  );
}

export default App;
