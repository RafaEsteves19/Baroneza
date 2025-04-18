import { useState, useEffect } from "react"
import axios from "axios"
import "./Carousel.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { password } from "../Login/Login"

function Carousel() {
  const [image, setImage] = useState(null)
  const [carouselData, setCarouselData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(password)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:5000/carousel")
      .then((res) => {
        setCarouselData(res.data)
        setError(null)
      })
      .catch((err) => {
        console.error("Erro ao carregar dados do carrossel", err)
        setError("Ocorreu um erro ao carregar as imagens.")
      })
  }, [])

  useEffect(() => {
    setIsAuthenticated(password)
    const checkPasswordInterval = setInterval(() => {
      setIsAuthenticated(password)
    }, 500)
    return () => clearInterval(checkPasswordInterval)
  }, [])

  useEffect(() => {
    if (carouselData.length > 0) {
      const autoRotationInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length)
      }, 8000)
      return () => clearInterval(autoRotationInterval)
    }
  }, [carouselData, currentIndex])

  const handleFileChange = (event) => {
    setImage(event.target.files[0])
  }

  const saveData = async () => {
    const formData = new FormData()
    if (image) {
      formData.append("image", image)
    }

    try {
      await axios.post("http://localhost:5000/save-carousel", formData)
      setImage(null)
      axios.get("http://localhost:5000/carousel").then((res) => setCarouselData(res.data))
    } catch (error) {
      console.error("Erro ao salvar imagem", error)
      setError("Erro ao salvar imagem.")
    }
  }

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length)
  }

  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length)
  }

  const deleteImage = async (imageUrl) => {
    const filename = imageUrl.split("/").pop()
    const confirmDelete = window.confirm("Você tem certeza que deseja apagar esta imagem?")
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/uploads/${filename}`)
        const res = await axios.get("http://localhost:5000/carousel")
        setCarouselData(res.data)
        if (currentIndex >= res.data.length) {
          setCurrentIndex(res.data.length - 1)
        }
      } catch (error) {
        console.error("Erro ao deletar a imagem", error)
        setError("Erro ao deletar imagem.")
      }
    }
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {carouselData.length > 0 && (
        <div className="carousel-container">
          <button className="carousel-arrow left" onClick={goToPrevImage}>&lt;</button>

          <div className="carousel">
            <div className="carousel-item">
              <img
                src={`http://localhost:5000${carouselData[currentIndex].image}`}
                alt={`Imagem ${currentIndex}`}
                style={{ width: "100%", height: "auto" }}
              />
              {isAuthenticated && (
                <button onClick={() => deleteImage(carouselData[currentIndex].image)} className="delete-button">
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </button>
              )}
            </div>
          </div>

          <button className="carousel-arrow right" onClick={goToNextImage}>&gt;</button>
        </div>
      )}

      {carouselData.length === 0 && <p>Não há imagens no carrossel.</p>}

      {isAuthenticated && (
        <>
          <hr />
          <button onClick={saveData} disabled={!image}>Salvar Imagem</button>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <hr />
        </>
      )}
    </div>
  )
}

export default Carousel
