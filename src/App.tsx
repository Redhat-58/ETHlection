import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Candidates from "./components/Candidates";
import CUSIS from "./components/CUSIS";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#e5e5e5", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/cusis" element={<CUSIS />} />
          <Route path="/" element={<Candidates />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
