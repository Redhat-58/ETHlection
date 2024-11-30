import { useContext } from "react";
import { Web3Context } from "../App";
import Web3 from "web3";

const OptionHelper = () => {
  const { changeWeb3, accountAddr, changeAccountAddr, contract } =
    useContext(Web3Context);

  const getAccount = async () => {
    if (!accountAddr) {
      // No account connected
      const web3 = new Web3(window.ethereum);
      if (web3) {
        // Wallet found
        changeWeb3(web3);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          changeAccountAddr(accounts[0]);
          localStorage.setItem("accountAddr", accounts[0]);
          console.log("Connected account:", accounts[0]);
        } catch (error) {
          console.error("User denied account access or error occurred:", error);
        }
      } else {
        // No wallet found
        console.error("No Wallet Found!");
      }
    } else {
      // Account already connected
      console.log("Wallet already connected:", accountAddr);
    }
  };

  const handleOption = async (option, formData) => {
    switch (option) {
      case "Register as Student":
        await getAccount();

        try {
          console.log("Account:", accountAddr);
          await contract.methods.addVoter(formData).estimateGas({
            from: accountAddr,
          });
          await contract.methods
            .addVoter(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Voter added successfully");
            });
        } catch (error) {
          console.error("Error adding voter:", error);
        }
        break;
      case "Apply as Candidate":
        await getAccount();

        console.log("Form data:", formData);
        if (
          !Array.isArray(formData) ||
          formData.some((item) => typeof item !== "string")
        ) {
          console.error("Form data is not in the correct format");
          return;
        }
        try {
          await contract.methods
            .addCandidate(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .addCandidate(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Candidate added successfully");
            });
        } catch (error) {
          console.error("Error adding candidate:", error);
        }
        break;
      case "Initiate an Election":
        await getAccount();

        try {
          await contract.methods.restart().estimateGas({ from: accountAddr });
          await contract.methods
            .restart()
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Election initiated successfully");
            });
        } catch (error) {
          console.error("Error initiating election:", error);
        }
        break;
      case "View All Voters":
        await getAccount();

        try {
          const result = await contract.methods.getAllVoters().call();
          console.log("All voters:", result);
        } catch (error) {
          console.error("Error viewing all voters:", error);
        }
        break;
      case "Edit Start/End Time":
        const result = await contract.methods.getStartEndTime().call();
        console.log(result);
        await getAccount();

        try {
          await contract.methods
            .editStartTime(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .editStartTime(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Start time edited successfully");
            });
        } catch (error) {
          console.error("Error editing start time:", error);
        }
        break;
      case "View Time":
        await getAccount();

        try {
          const result = await contract.methods.getStartEndTime().call();
          console.log("Current time:", result);
        } catch (error) {
          console.error("Error viewing time:", error);
        }
        break;
      case "Agree Time":
        await getAccount();

        try {
          await contract.methods
            .agreeStartEndTime()
            .estimateGas({ from: accountAddr });
          await contract.methods
            .agreeStartEndTime()
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Time agreed successfully");
            });
        } catch (error) {
          console.error("Error agreeing time:", error);
        }
        break;
      case "View Winner":
        await getAccount();

        try {
          const result = await contract.methods.getWinningCandidate().call();
          console.log("Winner:", result);
        } catch (error) {
          console.error("Error viewing winner:", error);
        }
        break;
      case "View Past Winners":
        await getAccount();

        try {
          const result = await contract.methods.getPastWinner().call();
          console.log("Past Winner:", result);
        } catch (error) {
          console.error("Error viewing past winners:", error);
        }
        break;
      default:
        console.error("Invalid option selected!");
    }
  };

  return { handleOption };
};

export default OptionHelper;
