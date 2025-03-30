import React, { useState, useEffect } from "react";
import axios from "axios";
import './Carousel.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Carousel() {
  const [image, setImage] = useState(null);
  const [fixedData, setFixedData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/data").then((res) => {
      setFixedData(res.data);
    });
  }, []);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const saveData = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:5000/save", formData);
      setImage(null);
      axios.get("http://localhost:5000/data").then((res) => setFixedData(res.data));
    } catch (error) {
      console.error("Error saving image", error);
    }
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fixedData.length);
  };

  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fixedData.length) % fixedData.length);
  };

  const deleteImage = async (imageUrl) => {
    const filename = imageUrl.split('/').pop();
    try {
      console.log(`Deletando imagem: ${filename}`);
      await axios.delete(`http://localhost:5000/uploads/${filename}`);

      axios.get("http://localhost:5000/data").then((res) => {
        setFixedData(res.data);


        if (currentIndex >= res.data.length) {
          setCurrentIndex(res.data.length - 1);
        }
      });
    } catch (error) {
      console.error("Erro ao deletar a imagem", error);
    }
  };

  return (
    <div>
      {fixedData.length > 0 && (
        <div className="carousel-container">
          <button className="carousel-arrow left" onClick={goToPrevImage}>&lt;</button>

          <div className="carousel">
            <div className="carousel-item">
              <img
                src={`http://localhost:5000${fixedData[currentIndex].image}`}
                alt={`Imagem ${currentIndex}`}
                style={{ width: "100%", height: "auto" }}
              />
              <button 
                onClick={() => deleteImage(fixedData[currentIndex].image)} 
                className="delete-button"
              >
                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
              </button>
            </div>
          </div>

          <button className="carousel-arrow right" onClick={goToNextImage}>&gt;</button>
        </div>
      )}

      {fixedData.length === 0 && <p>Não há imagens no carrossel.</p>}

      <hr />

      <button 
        onClick={saveData} 
        disabled={!image}
      >
        Salvar Imagem
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default Carousel;
