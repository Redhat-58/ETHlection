import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../App";
import CandidateCard from "./CandidateCard";

function Candidates() {
  const { contract } = useContext(Web3Context);
  const [candidates, setCandidates] = useState([]);

  // Fetch candidates from contract
  useEffect(() => {
    const fetchCandidates = async () => {
      if (contract) {
        try {
          const candidateList = await contract.methods
            .getAllCandidates()
            .call();
          console.log("Candidates fetched:", candidateList);
          setCandidates(candidateList);
        } catch (error) {
          console.error("Error fetching candidates:", error);
        }
      }
    };

    fetchCandidates();
  }, [contract]);

  return (
    <div className="container-fluid min-vh-100 bg-body-secondary p-4">
      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <div className="row row-cols-1 row-cols-md-3 g-4 p-4 mx-lg-5">
            <div className="col">
              <CandidateCard
                key={candidate.id}
                suName={candidate.info[0]}
                candidateName={candidate.info[1]}
                yos={candidate.info[2]}
                major={candidate.info[3]}
                college={candidate.info[4]}
                description={candidate.info[5]}
              />
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center fw-lighter ">No Ongoing Election.</h2>
      )}
    </div>
  );
}

export default Candidates;
