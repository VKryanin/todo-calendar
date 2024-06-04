import React from "react";
import s from "./App.module.scss";
import Calendar from "../components/Calendar/Calendar";
import NavBar from "../components/NavBar/NavBar";

const App: React.FC = () => {
  

  return (
    <div className={s.App}>
      <header style={{ gridArea: "header" }}>
        <h1>Calendar ToDo</h1>
      </header>
      <Calendar />
      <NavBar />
    </div>
  );
};

export default App;
