import { Link } from "react-router-dom";
import infantil from '../../images/ic-infantil.png';
import fundamental1 from '../../images/ic-fundamental-1.png';
import fundamental2 from '../../images/ic-fundamental-2.png';
import medio from '../../images/ic-medio.png';
import "./Steps.css";

function Steps() {
  const stepsData = [
    {
      id: 1,
      image: infantil,
      text: "Educação Infantil",
      route: "/educacao-infantil",
    },
    {
      id: 2,
      image: fundamental1,
      text: "Ensino Fundamental I",
      route: "/ensino-fundamental-1",
    },
    {
      id: 3,
      image: fundamental2,
      text: "Ensino Fundamental II",
      route: "/ensino-fundamental-2",
    },
    {
      id: 4,
      image: medio,
      text: "Ensino Médio",
      route: "/ensino-medio",
    },
  ];

  return (
    <div className="steps-container">
      <div className="steps-grid">
        {stepsData.map((step) => (
          <Link to={step.route} key={step.id} className="step-button">
            <div className="step-content">
              <img src={step.image} alt={step.text} className="step-image" />
              <p className="step-text">{step.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Steps;