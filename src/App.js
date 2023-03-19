import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Inventory from "./Components/Inventory";
import Main from "./Components/Main";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
