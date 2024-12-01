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
      case "Vote":
        await getAccount();

        try {
          await contract.methods
            .vote(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .vote(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              return "Voted successfully.";
            });
        } catch (error) {
          return "Error voting.";
        }
        break;
      case "Register as Student":
        await getAccount();

        try {
          await contract.methods.addVoter(formData).estimateGas({
            from: accountAddr,
          });
          await contract.methods
            .addVoter(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              return "Voter added successfully.";
            });
        } catch (error) {
          return "Error adding voter.";
        }
        break;
      case "Apply as Candidate":
        await getAccount();

        try {
          console.log("Form data after:", formData);
          console.log("Account address:", accountAddr);
          await contract.methods
            .addCandidate(formData)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .addCandidate(formData)
            .send({ from: accountAddr })
            .on("receipt", function () {
              return "Candidate added successfully.";
            });
        } catch (error) {
          console.error("Error adding candidate:", error);
          return "Error adding candidate.";
        }
        break;
      case "View Time":
        await getAccount();

        try {
          const result = await contract.methods.getStartEndTime().call();
          return "Start Time: " + result[0] + " End Time: " + result[1];
        } catch (error) {
          return "Error viewing time.";
        }
        break;
      case "View Winner":
        await getAccount();

        try {
          await contract.methods
            .findWinningCandidate()
            .estimateGas({ from: accountAddr });
          await contract.methods
            .findWinningCandidate()
            .send({ from: accountAddr });
          const result = await contract.methods.getWinningCandidate().call();
          return result[0];
        } catch (error) {
          return "Error viewing winner.";
        }
        break;
      case "View Past Winners":
        await getAccount();

        try {
          const result = await contract.methods.getPastWinner().call();
          return result.join(", ");
        } catch (error) {
          return "Error viewing past winners.";
        }
        break;
      case "View All Voters":
        await getAccount();

        try {
          const result = await contract.methods.getAllVoters().call();
          return result.map((voter) => voter.addr).join(", ");
        } catch (error) {
          return "Error viewing all voters.";
        }
        break;
      case "Edit Start/End Time":
        const [startTime, endTime] = formData.split(",");
        await getAccount();
        const convertedStartTime = Number(startTime);
        const convertedEndTime = Number(endTime);

        try {
          await contract.methods
            .editStartEndTimestamp(convertedStartTime, convertedEndTime)
            .estimateGas({ from: accountAddr });
          await contract.methods
            .editStartEndTimestamp(convertedStartTime, convertedEndTime)
            .send({ from: accountAddr })
            .on("receipt", function () {
              return "Start time edited successfully.";
            });
        } catch (error) {
          return "Error editing start/end time.";
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
              return "Election initiated successfully.";
            });
        } catch (error) {
          return "Error initiating election.";
        }
        break;
      default:
        return "Invalid option.";
    }
  };

  return { handleOption };
};

export default OptionHelper;
