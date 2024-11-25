import { useState } from "react";
import OptionHelper from "../helpers/OptionHelper";

function Lightbox({ isOpen, onClose, selectedOption }) {
  if (!isOpen) return null;
  const { handleOption } = OptionHelper();

  const [formData, setFormData] = useState("");

  const onInputChange = (e) => {
    setFormData(e.target.value); // Update formData with the input value
  };

  const onButtonClick = async () => {
    console.log("Button clicked:", formData);
    await handleOption(selectedOption, formData);
    onClose();
  };

  const buildContent = (hasInput = false, labelName) => {
    return (
      <>
        <div className="modal-body">
          {hasInput ? (
            <form>
              <div className="mb-3">
                <label htmlFor={`${labelName}-info`} className="col-form-label">
                  {labelName}:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`${labelName}-info`}
                  onChange={onInputChange}
                />
              </div>
            </form>
          ) : (
            <p>Waiting for transaction.(Or result is printed to console)</p>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-dark"
            onClick={onButtonClick}
          >
            Proceed
          </button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    // Render lightbox content based on selected option
    switch (selectedOption) {
      case "Apply as Candidate":
        return buildContent(true, "Info");
      case "Register as Student":
        return buildContent(true, "Student ID");
      case "Initiate an Election":
        return buildContent(false);
      case "Whitelist Voters":
        return buildContent(true, "Voters");
      case "View All Voters":
        return buildContent(false);
      case "Edit Start Time":
        return buildContent(true, "Start Time");
      case "Edit End Time":
        return buildContent(true, "End Time");
      case "View Time":
        return buildContent(false);
      case "Agree Time":
        return buildContent(false);
      case "View Winner":
        return buildContent(false);
      default:
        return (
          <>
            <div className="modal-body">
              <p>Something went wrong.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Return
              </button>
            </div>
          </>
        );
    }
  };

  // Lightbox definition
  return (
    <>
      <div
        className="modal show fade"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        id="optionBox"
        tabIndex="-1"
        aria-labelledby="optionBoxLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="optionBoxLabel">
                {selectedOption}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            {/* // Render body and footer based on selected option */}
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lightbox;
