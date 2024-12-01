function CandidateCard({
  candidateAddr,
  suName,
  candidateName,
  yos,
  college,
  major,
  description,
  onVote,
}) {
  return (
    <div className="card p-3 m-3 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{candidateName}</h2>
        <h4 className="card-subtitle mb-4 text-body-secondary">{suName}</h4>
        <div className="card-text mb-4 d-flex justify-content-between flex-wrap">
          <p className="card-text">
            <strong>Year of Study:</strong> {yos}
          </p>
          <p className="card-text">
            <strong>College:</strong> {college}
          </p>
          <p className="card-text">
            <strong>Major:</strong> {major}
          </p>
        </div>
        <p className="card-text">
          <strong>Description:</strong> {description}
        </p>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => onVote(candidateAddr)}
        >
          Vote
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
