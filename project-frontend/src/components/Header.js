import React from "react";
import "../css/App.css";

function Header({ handleLogin, handleRegister }) {
  return (
    <header className="header">
      <div className="theater-selection">
        <label htmlFor="theater">Valitse teatteri:</label>
        <select id="theater">
          <option value="1">Teatteri 1</option>
          <option value="2">Teatteri 2</option>
          <option value="3">Teatteri 3</option>
        </select>
      </div>
      <div className="user-actions">
        <button onClick={() => handleRegister(true) } >Rekisteröidy</button>
        <button onClick={() => handleLogin(true) } >Kirjaudu</button>
      </div>
    </header>
  );
}

export default Header;
