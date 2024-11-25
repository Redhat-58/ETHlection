function OptionCard({ optionName, onClick }) {
  return (
    <div
      className="card h-100"
      style={{
        cursor: "pointer", // Changes cursor to pointer on hover
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
        transition: "transform 0.2s", // Adds a hover effect
      }}
      onClick={onClick}
      role="button" // Accessibility: Indicates the div is interactive
      tabIndex="0" // Accessibility: Makes the div focusable
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div className="card-body">
        <h5 className="card-title fs-3 text-wrap text-center">{optionName}</h5>
      </div>
    </div>
  );
}

export default OptionCard;
