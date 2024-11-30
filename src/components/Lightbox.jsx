import { useState } from "react";
import OptionHelper from "../helpers/OptionHelper";

function Lightbox({ isOpen, onClose, selectedOption }) {
  if (!isOpen) return null;
  const { handleOption } = OptionHelper();

  const [formData, setFormData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onInputChange = (e) => {
    setFormData(e.target.value); // Update formData with the input value
  };

  const onSubmitInput = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    await handleOption(selectedOption, formData);
    setIsProcessing(false);
    onClose();
  };

  const buildContent = () => {
    if (isProcessing) {
      return (
        <div className="modal-body">
          <p>Processing..</p>
        </div>
      );
    }

    onSubmitInput({ preventDefault: () => {} });
    return (
      <div className="modal-body">
        <p>Waiting for transaction...</p>
      </div>
    );
  };

  const buildContentWithInput = (labelName) => {
    if (isProcessing) {
      return (
        <div className="modal-body">
          <p>Processing..</p>
        </div>
      );
    }

    if (labelName === "Time") {
      return (
        <div className="modal-body">
          <form onSubmit={onSubmitInput}>
            <div className="mb-3">
              <label htmlFor={`${labelName}-info`} className="col-form-label">
                {labelName}:
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id={`${labelName}-info`}
                onChange={onInputChange}
              />
            </div>
          </form>
        </div>
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
      case "Register as Student":
        return buildContentWithInput("Student ID");
      case "Initiate an Election":
        return buildContent();
      case "View All Voters":
        return buildContent();
      case "Edit Start/End Time":
        return buildContentWithInput("Start/End Time");
      case "View Time":
        return buildContent();
      case "Agree Time":
        return buildContent();
      case "View Winner":
        return buildContent();
      case "View Past Winners":
        return buildContent();
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
