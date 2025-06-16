import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Home from "./Pages/Home";
import About from "./Pages/About.js";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
