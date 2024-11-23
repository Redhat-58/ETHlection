import { useContext, useState } from "react";
import { Web3Context } from "../App";
import OptionCard from "./OptionCard";
import Lightbox from "./Lightbox";
import Web3 from "web3";

function CUSIS() {
  const { setWeb3, setAccount } = useContext(Web3Context);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const options = [
    {
      id: 1,
      title: "Apply as Candidate",
      handler: () => handleOptionClick("Apply as Candidate"),
    },
    {
      id: 2,
      title: "Register as Student",
      handler: () => handleOptionClick("Register as Student"),
    },
    {
      id: 3,
      title: "Initiate an Election",
      handler: () => handleOptionClick("Initiate an Election"),
    },
    {
      id: 4,
      title: "End an Election",
      handler: () => handleOptionClick("End an Election"),
    },
    {
      id: 5,
      title: "View All Voters",
      handler: () => handleOptionClick("View All Voters"),
    },
    {
      id: 6,
      title: "View All Candidates",
      handler: () => handleOptionClick("View All Candidates"),
    },
    {
      id: 7,
      title: "Edit Time",
      handler: () => handleOptionClick("Edit Time"),
    },
    {
      id: 8,
      title: "View Time",
      handler: () => handleOptionClick("View Time"),
    },
    {
      id: 9,
      title: "Agree Time",
      handler: () => handleOptionClick("Agree Time"),
    },
    { id: 10, title: "Connect Wallet", handler: connectWallet },
  ];

  // Handle click with different functions for each option
  function handleOptionClick(option) {
    console.log("Option clicked:", option);
    setSelectedOption(option);
    setIsLightboxOpen(true);
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3);

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      console.error("No Wallet Found!");
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "5px",
              padding: "20px",
              margin: "10px",
              width: "200px",
              textAlign: "center",
            }}
            optionName={option.title}
            onClick={option.handler}
          />
        ))}
      </div>
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        selectedOption={selectedOption}
      />
    </>
  );
}

export default CUSIS;
