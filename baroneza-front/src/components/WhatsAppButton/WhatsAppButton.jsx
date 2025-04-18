import React, { useState } from 'react';
import './WhatsAppButton.css';
import whatsappLogo from '../../images/whatsapp.png';

const WhatsAppButton = () => {
    const [hover, setHover] = useState(false);
  
    const link = 'https://api.whatsapp.com/send/?phone=551934212411&text=Ol%C3%A1%2C+quero+mais+informa%C3%A7%C3%B5es...&type=phone_number&app_absent=0';
  
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className={`whatsapp-text ${hover ? 'show' : ''}`}>Chame no WhatsApp</span>
        <img
          src={whatsappLogo}
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    );
  };
  
  export default WhatsAppButton;