import { useState, useContext } from "react";
import { Web3Context } from "../App";
import OptionCard from "./OptionCard";
import Lightbox from "./Lightbox";

function CUSIS() {
  const [selectedOption, setSelectedOption] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { accountAddr } = useContext(Web3Context);
  const options = [
    {
      title: "Register as Student",
      restricted: false,
      handler: () => handleOptionClick("Register as Student"),
    },
    {
      title: "Apply as Candidate",
      restricted: false,
      handler: () => handleOptionClick("Apply as Candidate"),
    },
    {
      title: "Initiate an Election",
      restricted: true,
      handler: () => handleOptionClick("Initiate an Election"),
    },
    {
      title: "Edit Start Time",
      restricted: true,
      handler: () => handleOptionClick("Edit Start Time"),
    },
    {
      title: "Edit End Time",
      restricted: true,
      handler: () => handleOptionClick("Edit End Time"),
    },
    {
      title: "View All Voters",
      restricted: true,
      handler: () => handleOptionClick("View All Voters"),
    },
    {
      title: "View Time",
      restricted: false,
      handler: () => handleOptionClick("View Time"),
    },
    {
      title: "View Winner",
      restricted: false,
      handler: () => handleOptionClick("View Winner"),
    },
  ];
  const ownerAddress = "0x6bfA52F276D6Cd28625CF776ca37d77f233607Ef";

  // Handle click with different functions for each option
  const handleOptionClick = (option) => {
    console.log("Option clicked:", option);
    setSelectedOption(option);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="container">
        <div className="row row-cols-2 row-cols-md-4 g-4 p-2">
          {options
            .filter(
              (option) => !option.restricted || accountAddr === ownerAddress
            )
            .map((option) => (
              <div className="col" key={option.title}>
                <OptionCard
                  optionName={option.title}
                  onClick={option.handler}
                />
              </div>
            ))}
        </div>
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
