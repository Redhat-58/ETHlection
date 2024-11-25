import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../App";
import CandidateCard from "./CandidateCard";

function Candidates() {
  const { web3, contract } = useContext(Web3Context);
  const [candidates, setCandidates] = useState([]);

  // Fetch candidates from contract
  useEffect(() => {
    const fetchCandidates = async () => {
      if (web3 && contract) {
        try {
          setCandidates(await contract.methods.getAllCandidates().call());
        } catch (error) {
          console.error("Error fetching candidates:", error);
        }
      }
    };

    fetchCandidates();
  }, [web3, contract]);

  return (
    <div className="container d-flex justify-content-evenly flex-wrap flex-grow-1">
      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            suName={candidate.suName}
            candidateName={candidate.CandidateName}
            yos={candidate.yos}
            college={candidate.college}
            major={candidate.major}
            description={candidate.description}
          />
        ))
      ) : (
        <p className="text-center fs-2 fw-lighter ">No Ongoing Election.</p>
      )}
    </div>
  );
}

export default Candidates;
