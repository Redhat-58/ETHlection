// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Candidates from "./components/Candidates";
import CUSIS from "./components/CUSIS";
import { useState, createContext } from "react";
import Web3 from "web3";

export const Web3Context = createContext({
  web3: null,
  setWeb3: () => {},
  account: "",
  setAccount: () => {},
});

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  // console.log("Web3 instance:", web3);
  // console.log("Account:", account);

  // const compileData = "contract/Election.json"; // Path to compile data

  // useEffect(() => {
  //   initializeWeb3();
  // }, []);

  return (
    <Router>
      <div style={{ backgroundColor: "#e5e5e5", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/cusis" element={<CUSIS />} />
          <Route path="/" element={<CUSIS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
