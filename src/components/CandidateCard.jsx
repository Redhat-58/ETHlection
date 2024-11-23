function CandidateCard({
  suName,
  candidateName,
  yos,
  college,
  major,
  description,
}) {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{candidateName}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{suName}</h6>
        <p className="card-text">Year of Study: {yos}</p>
        <p className="card-text">College: {college}</p>
        <p className="card-text">Major: {major}</p>
        <p className="card-text">Description: {description}</p>
      </div>
    </div>
  );
}

export default CandidateCard;
