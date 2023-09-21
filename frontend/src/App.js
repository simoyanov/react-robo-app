import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import CreateRecord from "./components/CreateRecord";
import EditRecord from "./components/EditRecord";
import RecordList from "./components/RecordList";

function App() {
  return (
    <Router>
      <div className="App">
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
      </div>
    </Router>
  );
}

export default App;
