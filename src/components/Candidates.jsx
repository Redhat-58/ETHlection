import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../App";
import CandidateCard from "./CandidateCard";
import Lightbox from "./Lightbox";
import OptionHelper from "../helpers/OptionHelper";

// Candidates Page
function Candidates() {
  const { contract } = useContext(Web3Context);
  const [candidates, setCandidates] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [result, setResult] = useState("");

  // Fetch candidates from contract
  useEffect(() => {
    const fetchCandidates = async () => {
      if (contract) {
        try {
          const result = await contract.methods.getStartEndTime().call();
          const startTime = Number(result[0]);
          const endTime = Number(result[1]);
          const now = Math.floor(Date.now() / 1000); // Current time in seconds
          if (now >= startTime && now <= endTime) {
            const candidateList = await contract.methods
              .getAllCandidates()
              .call();
            setCandidates(candidateList);
          }
        } catch (error) {
          console.error("Error fetching candidates:", error);
        }
      }
    };

    fetchCandidates();
  }, [contract]);

  const handleVote = async (candidateAddr) => {
    setResult([candidateAddr]);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="container-fluid min-vh-100 bg-body-secondary p-4">
        {candidates.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3 g-4 p-4 mx-lg-5">
            {candidates.map((candidate, index) => (
              <div className="col" key={index}>
                <CandidateCard
                  candidateAddr={candidate.addr}
                  suName={candidate.info[0]}
                  candidateName={candidate.info[1]}
                  yos={candidate.info[2]}
                  major={candidate.info[3]}
                  college={candidate.info[4]}
                  description={candidate.info[5]}
                  onVote={handleVote}
                />
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-center fw-lighter ">No Candidates.</h2>
        )}
      </div>
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        selectedOption={"Vote"}
        formResult={result}
      />
    </>
  );
}

export default Candidates;
