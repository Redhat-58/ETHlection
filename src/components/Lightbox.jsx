function Lightbox({ isOpen, onClose, selectedOption }) {
  console.log("Lightbox props:", { isOpen, selectedOption });
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal fade"
        id="optionBox"
        tabIndex="-1"
        aria-labelledby="optionBoxLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="optionBoxLabel">
                {selectedOption || "Modal Title"}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <form>
                <div className="mb-3">
                  <label for="value" className="col-form-label">
                    Value:
                  </label>
                  <input type="text" className="form-control" id="value" />
                </div>
              </form> */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Lightbox;
