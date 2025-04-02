import { useState, useEffect } from "react"
import axios from "axios"
import "./Carousel.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { password } from "../Login/Login" 

function Carousel() {
  const [image, setImage] = useState(null)
  const [carouselData, setCarouselData] = useState([]) // De volta para "carouselData"
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(password)
  const [error, setError] = useState(null)  // Estado para armazenar mensagens de erro

  // Carregar dados do carrossel
  useEffect(() => {
    axios.get("http://localhost:5000/carousel") // Usando /carousel novamente
      .then((res) => {
        setCarouselData(res.data)
        setError(null)  // Resetar erro ao carregar dados com sucesso
      })
      .catch((err) => {
        console.error("Erro ao carregar dados do carrossel", err)
        setError("Ocorreu um erro ao carregar as imagens. Tente novamente mais tarde.")  // Mensagem genérica
      })
  }, [])

  // Verificação de autenticação
  useEffect(() => {
    setIsAuthenticated(password)

    const checkPasswordInterval = setInterval(() => {
      setIsAuthenticated(password)
    }, 500)

    return () => {
      clearInterval(checkPasswordInterval)
    }
  }, [])

  // Auto-rotacionar imagens
  useEffect(() => {
    if (carouselData.length > 0) {
      const autoRotationInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length)
      }, 8000)

      return () => clearInterval(autoRotationInterval)
    }
  }, [carouselData, currentIndex])

  // Alterar arquivo de imagem
  const handleFileChange = (event) => {
    setImage(event.target.files[0])
  }

  // Salvar dados no servidor
  const saveData = async () => {
    const formData = new FormData()
    if (image) {
      formData.append("image", image)
    }

    try {
      await axios.post("http://localhost:5000/save", formData) // Mantendo /save
      setImage(null)
      axios.get("http://localhost:5000/carousel")
        .then((res) => setCarouselData(res.data))
        .catch((err) => {
          console.error("Erro ao recarregar dados após salvar", err)
          setError("Ocorreu um erro ao recarregar as imagens. Tente novamente mais tarde.")
        })
    } catch (error) {
      console.error("Erro ao salvar imagem", error)
      setError("Ocorreu um erro ao salvar a imagem. Tente novamente mais tarde.")
    }
  }

  // Navegar para a próxima imagem
  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length)
  }

  // Navegar para a imagem anterior
  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length)
  }

  // Deletar uma imagem
  const deleteImage = async (imageUrl) => {
    const filename = imageUrl.split("/").pop()
    const confirmDelete = window.confirm("Você tem certeza que deseja apagar esta imagem?")
    
    if (confirmDelete) {
      try {
        console.log(`Deletando imagem: ${filename}`)
        await axios.delete(`http://localhost:5000/uploads/${filename}`)
        axios.get("http://localhost:5000/carousel")
          .then((res) => {
            setCarouselData(res.data)

            // Se a imagem deletada for a atual, ajustar o índice
            if (currentIndex >= res.data.length) {
              setCurrentIndex(res.data.length - 1)
            }
          })
          .catch((err) => {
            console.error("Erro ao recarregar dados após deletar", err)
            setError("Ocorreu um erro ao recarregar as imagens. Tente novamente mais tarde.")
          })
      } catch (error) {
        console.error("Erro ao deletar a imagem", error)
        setError("Ocorreu um erro ao deletar a imagem. Tente novamente mais tarde.")
      }
    }
  }

  return (
    <div>
      {/* Exibir mensagem de erro, se houver */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Carrossel de imagens */}
      {carouselData.length > 0 && (
        <div className="carousel-container">
          <button className="carousel-arrow left" onClick={goToPrevImage}>
            &lt;
          </button>

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

          <button className="carousel-arrow right" onClick={goToNextImage}>
            &gt;
          </button>
        </div>
      )}

      {/* Caso não haja imagens no carrossel */}
      {carouselData.length === 0 && <p>Não há imagens no carrossel.</p>}

      {/* Se estiver autenticado, mostrar opções para salvar imagem */}
      {isAuthenticated && (
        <>
          <hr />
          <button onClick={saveData} disabled={!image}>
            Salvar Imagem
          </button>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <hr />
        </>
      )}
    </div>
  )
}

export default Carousel