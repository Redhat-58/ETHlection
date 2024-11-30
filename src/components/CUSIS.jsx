import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../App";
import OptionCard from "./OptionCard";
import Lightbox from "./Lightbox";

function CUSIS() {
  const [selectedOption, setSelectedOption] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { accountAddr, contract } = useContext(Web3Context);
  const navigate = useNavigate();
  const options = [
    {
      title: "Register as Student",
      restricted: false,
      handler: () => handleOptionClick("Register as Student", false),
    },
    {
      title: "Apply as Candidate",
      restricted: false,
      handler: () => handleOptionClick("Apply as Candidate", true),
    },
    {
      title: "Initiate an Election",
      restricted: true,
      handler: () => handleOptionClick("Initiate an Election", false),
    },
    {
      title: "Edit Start/End Time",
      restricted: true,
      handler: () => handleOptionClick("Edit Start/End Time", false),
    },
    {
      title: "View All Voters",
      restricted: true,
      handler: () => handleOptionClick("View All Voters", false),
    },
    {
      title: "View Time",
      restricted: false,
      handler: () => handleOptionClick("View Time", false),
    },
    {
      title: "View Winner",
      restricted: false,
      handler: () => handleOptionClick("View Winner", false),
    },
    {
      title: "View Past Winners",
      restricted: false,
      handler: () => handleOptionClick("View Past Winners", false),
    },
  ];

  // Handle click with different functions for each option
  const handleOptionClick = (option, hasForm) => {
    console.log("Option clicked:", option);
    if (hasForm) {
      navigate("/applyform");
    } else {
      setSelectedOption(option);
      setLightboxOpen(true);
    }
  };

  useEffect(() => {
    const checkOwner = async () => {
      if (contract && accountAddr) {
        try {
          console.log("Address:", accountAddr);
          // const addr = await contract.methods.checkOwner(accountAddr).call();
          const addr = "0x6bfa52f276d6cd28625cf776ca37d77f233607ef";
          if (accountAddr === addr) {
            setIsOwner(true);
          }
        } catch (error) {
          console.error("Error checking owner status:", error);
        }
      }
    };

    checkOwner();
  }, [accountAddr]);

  return (
    <>
      <div className="container-fluid min-vh-100 bg-body-secondary">
        <div className="row row-cols-2 row-cols-md-4 g-4 p-4 mx-lg-5">
          {options
            .filter((option) => !option.restricted || isOwner)
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
