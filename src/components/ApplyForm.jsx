import { useState } from "react";
import Lightbox from "./Lightbox";

function ApplyForm() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [formResult, setFormResult] = useState([]);

  function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataArray = [
      formData.get("suName"),
      formData.get("candidateName"),
      formData.get("yos"),
      formData.get("major"),
      formData.get("college"),
      formData.get("description"),
    ];
    setFormResult(formDataArray);
    setLightboxOpen(true);
  }

  return (
    <>
      <div className="container-fluid bg-body-secondary">
        <div className="row min-vh-100">
          <div className="col" />
          <div className="col-6 bg-white p-4">
            <form onSubmit={onSubmit}>
              <h2 className="text-center">Candidate Application Form</h2>
              <div className="mb-3">
                <label htmlFor="suName" className="form-label">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="suName"
                  name="suName"
                  placeholder="E.g. CUnion"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="candidateName" className="form-label">
                  Candidate Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="candidateName"
                  name="candidateName"
                  placeholder="E.g. John Doe"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="yos" className="form-label">
                  Year of Study
                </label>
                <select className="form-select" name="yos">
                  <option>Select the year of study</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="major" className="form-label">
                  Major
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="major"
                  name="major"
                  placeholder="E.g. Computer Science"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="college" className="form-label">
                  College
                </label>
                <select className="form-select" name="college">
                  <option>Select a college</option>
                  <option value="Chung Chi College">Chung Chi College</option>
                  <option value="New Asia College">New Asia College</option>
                  <option value="United College">United College</option>
                  <option value="Shaw College">Shaw College</option>
                  <option value="Morningside College">
                    Morningside College
                  </option>
                  <option value="S.H. Ho College">S.H. Ho College</option>
                  <option value="CW Chu College">CW Chu College</option>
                  <option value="Wu Yee Sun College">Wu Yee Sun College</option>
                  <option value="Lee Woo Sing College">
                    Lee Woo Sing College
                  </option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="descrption"
                  name="description"
                  placeholder="E.g. We will serve all CU students."
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
          <div className="col" />
        </div>
      </div>
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        selectedOption={"Apply as Candidate"}
        formResult={formResult}
      />
    </>
  );
}

export default ApplyForm;
