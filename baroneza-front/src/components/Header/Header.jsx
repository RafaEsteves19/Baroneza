import React from "react";
import logo from '../../images/logo.png';
import './Header.css';

import { FaInstagram, FaYoutube, FaFacebook, FaLock } from 'react-icons/fa';

function Header() {
  return (
    <div className="header">
      <img
        className="logo"
        src={logo}
        alt="Logo Instituto Baroneza de Rezende"
      />
      <div className="header-btns">
        <a
          href="https://www.youtube.com/channel/UCelA2lkhO8vetiWwy1rIA0w"
          className="social-btn"
          id="youtube"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube />
        </a>
        <a
          href="https://web.facebook.com/baronezaderezende?_rdc=1&_rdr#"
          className="social-btn"
          id="facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.instagram.com/baronezaderezende/"
          className="social-btn"
          id="instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a
          href="https://portal.sophia.com.br/SophiA_91/Acesso.aspx?escola=5022"
          className="area-restrita"
          id="area-restrita"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLock/> Área Restrita
        </a>
      </div>
    </div>
  );
}

export default Header;
