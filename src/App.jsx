import React from "react";
import { createBrowserHistory } from "history";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import MintPage from "./components/pages/MintPage";

const App = () => {
  const history = createBrowserHistory();
  return (
    <BrowserRouter history={history}>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route index element={<Homepage />} />
        <Route path="/MintPage" element={<MintPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
