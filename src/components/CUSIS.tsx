const options = [
  { id: 1, title: "Apply as Candidate" },
  { id: 2, title: "Register as Student" },
  { id: 3, title: "Initiate an Election" },
  { id: 4, title: "End an Election" },
];

function CUSIS() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {options.map((option) => (
        <div
          key={option.id}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "5px",
            padding: "20px",
            margin: "10px",
            width: "200px",
            textAlign: "center",
          }}
        >
          <h3>{option.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default CUSIS;
