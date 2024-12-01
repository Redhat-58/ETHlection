import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Candidates from "./components/Candidates";
import CUSIS from "./components/CUSIS";
import ApplyForm from "./components/ApplyForm";
import Web3 from "web3";

export const Web3Context = createContext(null);
let didInit = false;

function App() {
  const [web3, setWeb3] = useState(
    new Web3("https://ethereum-holesky-rpc.publicnode.com")
  );
  const [accountAddr, setAccountAddr] = useState("");
  const [contract, setContract] = useState(null);
  const contractABI = [
    {
      inputs: [{ internalType: "string[]", name: "info", type: "string[]" }],
      name: "addCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "addr", type: "address" }],
      name: "addOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "sid", type: "uint256" }],
      name: "addVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_startTime", type: "uint256" },
        { internalType: "uint256", name: "_endTime", type: "uint256" },
      ],
      name: "editStartEndTimestamp",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "findWinningCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "restart",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      inputs: [
        { internalType: "address", name: "_candidate", type: "address" },
      ],
      name: "voteCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "addr", type: "address" }],
      name: "checkOwner",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllCandidates",
      outputs: [
        {
          components: [
            { internalType: "address", name: "addr", type: "address" },
            { internalType: "uint256", name: "votes", type: "uint256" },
            { internalType: "string[]", name: "info", type: "string[]" },
          ],
          internalType: "struct Election.Candidate[]",
          name: "_addresses",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllVoters",
      outputs: [
        {
          components: [
            { internalType: "address", name: "addr", type: "address" },
            { internalType: "bool", name: "voted", type: "bool" },
            { internalType: "uint256", name: "candidateId", type: "uint256" },
            { internalType: "uint256", name: "sid", type: "uint256" },
          ],
          internalType: "struct Election.Voter[]",
          name: "addresses",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPastWinner",
      outputs: [
        {
          components: [
            { internalType: "address", name: "addr", type: "address" },
            { internalType: "uint256", name: "votes", type: "uint256" },
            { internalType: "string[]", name: "info", type: "string[]" },
          ],
          internalType: "struct Election.Candidate[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getStartEndTime",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getWinningCandidate",
      outputs: [
        {
          components: [
            { internalType: "address", name: "addr", type: "address" },
            { internalType: "uint256", name: "votes", type: "uint256" },
            { internalType: "string[]", name: "info", type: "string[]" },
          ],
          internalType: "struct Election.Candidate[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const contractAddr = "0x8A344f6b36fc3d6Ef96ed8b0Df19c8efa5BaB94D"; // Last deployed contract address

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      const newWeb3 = new Web3(window.ethereum);
      if (hasExistingAccount()) {
        changeWeb3(newWeb3);
      }
      setContract(new newWeb3.eth.Contract(contractABI, contractAddr));
    }

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log("Account changed:", accounts[0]);
      if (accounts.length > 0) {
        setAccountAddr(accounts[0]);
        localStorage.setItem("accountAddr", accounts[0]);
      } else {
        setAccountAddr("");
        localStorage.removeItem("accountAddr");
      }
    });
  }, []);

  const hasExistingAccount = () => {
    const exisitngAccount = localStorage.getItem("accountAddr");
    if (exisitngAccount) {
      changeAccountAddr(exisitngAccount);
      return true;
    }
    return false;
  };

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
        accountAddr,
        contract,
        contractAddr,
        changeWeb3,
        changeAccountAddr,
      }}
    >
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/cusis" element={<CUSIS />} />
            <Route path="/applyform" element={<ApplyForm />} />
            <Route path="*" element={<Candidates />} />
          </Routes>
        </div>
      </Router>
    </Web3Context.Provider>
  );
}

export default App;
