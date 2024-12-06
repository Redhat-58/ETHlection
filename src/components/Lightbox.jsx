import { useState, useEffect } from "react";
import OptionHelper from "../helpers/OptionHelper";

function Lightbox({ isOpen, onClose, selectedOption, formResult = [] }) {
  const { handleOption } = OptionHelper();

  const [formData, setFormData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const onInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "startTime") {
      setStartTime(value);
      const startTimestamp = new Date(value).getTime() / 1000; // Convert to Unix timestamp
      setFormData(`${startTimestamp},${endTime}`);
    } else if (id === "endTime") {
      setEndTime(value);
      const endTimestamp = new Date(value).getTime() / 1000; // Convert to Unix timestamp
      setFormData(`${startTime},${endTimestamp}`);
    } else {
      setFormData(value); // Update formData with the input value
    }
  };

  // If current option is "Edit Start/End Time", update formData with the selected start and end time
  useEffect(() => {
    if (startTime && endTime) {
      const startTimestamp = new Date(startTime).getTime() / 1000;
      const endTimestamp = new Date(endTime).getTime() / 1000;
      setFormData(`${startTimestamp},${endTimestamp}`);
    }
  }, [startTime, endTime]);

  // Call handleOption function and display the result in the lightbox
  const onSubmitInput = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    let returnedResult;
    if (formResult.length > 0) {
      setFormData(formResult);
      returnedResult = await handleOption(selectedOption, formData, formResult);
    } else {
      returnedResult = await handleOption(selectedOption, formData);
    }
    setResult(returnedResult);
    setIsProcessing(false);
  };

  // Call onSubmitInput function when the lightbox is opened
  useEffect(() => {
    setResult("");
    if (
      !["Register as Student", "Edit Start/End Time"].includes(selectedOption)
    ) {
      if (isOpen) {
        onSubmitInput({ preventDefault: () => {} });
      }
    }
  }, [selectedOption, isOpen]);

  // Do not render lightbox if option has not been selected in CUSIS
  if (!isOpen) return null;

  // Build lightbox content for options without input
  const buildContent = () => {
    if (isProcessing) {
      return (
        <div className="modal-body">
          <p>Waiting for transaction...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="modal-body">
          {result.includes("\n") ? (
            result.split("\n").map((part, index) => <p key={index}>{part}</p>)
          ) : (
            <p>{result}</p>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="modal-body">
          <p>No result.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-dark" onClick={onClose}>
            Return
          </button>
        </div>
      </>
    );
  };

  const buildContentWithInput = (labelName) => {
    if (isProcessing) {
      return (
        <div className="modal-body">
          <p>Waiting for transaction...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="modal-body">
          <p>{result}</p>
        </div>
      );
    }

    if (selectedOption === "Edit Start/End Time") {
      return (
        <>
          <div className="modal-body">
            <form onSubmit={onSubmitInput}>
              <div className="mb-3">
                <label htmlFor="startTime" className="col-form-label">
                  Start Time:
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="startTime"
                  onChange={onInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endTime" className="col-form-label">
                  End Time:
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="endTime"
                  onChange={onInputChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-dark"
              onClick={onSubmitInput}
            >
              Proceed
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="modal-body">
          <form onSubmit={onSubmitInput}>
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
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-dark"
            onClick={onSubmitInput}
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
      case "Vote":
        return buildContent();
      case "Register as Student":
        return buildContentWithInput("Student ID");
      case "Apply as Candidate":
        return buildContent();
      case "View Time":
        return buildContent();
      case "View Winner":
        return buildContent();
      case "View Past Winners":
        return buildContent();
      case "View All Voters":
        return buildContent();
      case "Edit Start/End Time":
        return buildContentWithInput("Start/End Time");
      case "Initiate an Election":
        return buildContent();
      default:
        return (
          <>
            <div className="modal-body">
              <p>Something went wrong.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={onClose}>
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
