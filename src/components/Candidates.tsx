import CandidateCard from "./CandidateCard";

const candidates = [
  {
    id: 1,
    suName: "SuperUnion",
    CandidateName: "Alice",
    yos: 1,
    college: "United College",
    major: "Computer Science",
    description: "I will try my best",
  },
  {
    id: 2,
    suName: "HyperUnion",
    CandidateName: "Bob",
    yos: 2,
    college: "Shaw College",
    major: "Computer Engineering",
    description: "Vote or die",
  },
];

function Candidates() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          suName={candidate.suName}
          candidateName={candidate.CandidateName}
          yos={candidate.yos}
          college={candidate.college}
          major={candidate.major}
          description={candidate.description}
        />
      ))}
    </div>
  );
}

export default Candidates;
