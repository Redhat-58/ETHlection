import { useState } from "react";
import OptionCard from "./OptionCard";
import Lightbox from "./Lightbox";

function CUSIS() {
  const [selectedOption, setSelectedOption] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const options = [
    {
      id: 1,
      title: "Apply as Candidate",
      handler: () => handleOptionClick("Apply as Candidate"),
    },
    {
      id: 2,
      title: "Register as Student",
      handler: () => handleOptionClick("Register as Student"),
    },
    {
      id: 3,
      title: "Initiate an Election",
      handler: () => handleOptionClick("Initiate an Election"),
    },
    {
      id: 4,
      title: "Whitelist Voters",
      handler: () => handleOptionClick("Whitelist Voters"),
    },
    {
      id: 5,
      title: "View All Voters",
      handler: () => handleOptionClick("View All Voters"),
    },
    {
      id: 6,
      title: "View All Candidates",
      handler: () => handleOptionClick("View All Candidates"),
    },
    {
      id: 7,
      title: "Edit Start Time",
      handler: () => handleOptionClick("Edit Start Time"),
    },
    {
      id: 8,
      title: "Edit End Time",
      handler: () => handleOptionClick("Edit End Time"),
    },
    {
      id: 9,
      title: "View Time",
      handler: () => handleOptionClick("View Time"),
    },
    {
      id: 10,
      title: "Agree Time",
      handler: () => handleOptionClick("Agree Time"),
    },
    {
      id: 11,
      title: "View Winner",
      handler: () => handleOptionClick("View Winner"),
    },
  ];

  // Handle click with different functions for each option
  const handleOptionClick = (option) => {
    console.log("Option clicked:", option);
    setSelectedOption(option);
    setLightboxOpen(true);
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "5px",
              padding: "20px",
              margin: "10px",
              width: "200px",
              textAlign: "center",
            }}
            optionName={option.title}
            onClick={option.handler}
          />
        ))}
      </div>
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        selectedOption={selectedOption}
      />
    </>
  );
}

export default CUSIS;
