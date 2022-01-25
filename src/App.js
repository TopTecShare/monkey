// import logo from "./logo.svg";
import "./App.scss";
import Dashboard from "./Dashboard";
import Whitelist from "./components/Whitelist";
import Claim from "./components/Claim";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      {/* <Header /> */}

      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="/claim" element={<Claim />} />
        <Route path="/whitelist" element={<Whitelist />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
