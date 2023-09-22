import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container } from "@mui/material";

import CreateRecord from "./components/CreateRecord";
import EditRecord from "./components/EditRecord";
import RecordList from "./components/RecordList";

function App() {
  return (
    <Router>
      <div className="App">
        <Container maxWidth="lg">
          <h1>Мое приложение</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Список записей</Link>
              </li>
              <li>
                <Link to="/create">Создать запись</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/create" element={<CreateRecord />} />
            <Route path="/edit/:id" element={<EditRecord />} />
            <Route path="/" element={<RecordList />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
