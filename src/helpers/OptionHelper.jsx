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
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          changeWeb3(web3);

          const accounts = await web3.eth.getAccounts();
          changeAccountAddr(accounts[0]);
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
      case "Apply as Candidate":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
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
      case "Register as Student":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          await contract.methods
            .addVoter("placeholderInfo")
            .estimateGas({ from: accountAddr });
          await contract.methods
            .addVoter("placeholderInfo")
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Voter added successfully");
            });
        } catch (error) {
          console.error("Error adding voter:", error);
        }
        break;
      case "Initiate an Election":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

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
      case "End an Election":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          await contract.methods.end().estimateGas({ from: accountAddr });
          await contract.methods
            .end()
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Election ended successfully");
            });
        } catch (error) {
          console.error("Error ending election:", error);
        }
        break;
      case "Whitelist Voters":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          await contract.methods
            .whitelist(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .whitelist(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("Voters whitelisted successfully");
            });
        } catch (error) {
          console.error("Error whitelisting voters:", error);
        }
        break;
      case "View All Voters":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          const result = await contract.methods.getAllVoters().call();
          console.log("All voters:", result);
        } catch (error) {
          console.error("Error viewing all voters:", error);
        }
        break;
      case "View All Candidates":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          const result = await contract.methods.getAllCandidates().call();
          console.log("All candidates:", result);
        } catch (error) {
          console.error("Error viewing all candidates:", error);
        }
        break;
      case "Edit Start Time":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

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
      case "Edit End Time":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          await contract.methods
            .editEndTime(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .editEndTime(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              console.log("End time edited successfully");
            });
        } catch (error) {
          console.error("Error editing end time:", error);
        }
        break;
      case "View Time":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          const result = await contract.methods.getStartEndTime().call();
          console.log("Current time:", result);
        } catch (error) {
          console.error("Error viewing time:", error);
        }
        break;
      case "Agree Time":
        await getAccount();
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

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
        while (!accountAddr) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
          const result = await contract.methods.getWinningCandidate().call();
          console.log("Winner:", result);
        } catch (error) {
          console.error("Error viewing winner:", error);
        }
      default:
        console.error("Invalid option selected!");
    }
  };

  return { handleOption };
};

export default OptionHelper;
