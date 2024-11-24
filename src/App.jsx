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
  const [contractABI, setContractABI] = useState({});
  const [contract, setContract] = useState(null);
  const contractAddr = "0xf9E2e95C2c98c663f4709243ca12eD56C11C6F16";
  const compileData = "../contracts/Election.json"; // Path to compile data

  useEffect(() => {
    // const web3Provider = new Web3(
    //   new Web3.providers.HttpProvider(
    //     "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
    //   )
    // );
    // setWeb3(web3Provider);

    fetch(compileData)
      .then((response) => response.json())
      .then((data) => {
        setContractABI(data.abi);
      });
  }, []);

  useEffect(() => {
    console.log("Web3:", web3);
    if (web3 && contractABI && contractAddr) {
      setContract(new web3.eth.Contract(contractABI, contractAddr));
      console.log("Contract set");
    }
  }, [web3, contractABI, contractAddr]);

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
            <Route path="/" element={<Candidates />} />
          </Routes>
        </div>
      </Router>
    </Web3Context.Provider>
  );
}

export default App;
