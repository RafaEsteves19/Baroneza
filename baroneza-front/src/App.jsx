import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header/Header"
import Carrossel from "./components/Carousel/Carousel"
import Lock from "./components/Lock/Lock"
import Login, { password } from "./components/Login/Login"
import Steps from "./components/Steps/Steps"

import "./App.css"

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isAuthenticated, setIsAuthenticated] = useState(password)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    setIsAuthenticated(password)

    const checkPasswordInterval = setInterval(() => {
      setIsAuthenticated(password)
    }, 500)

    return () => {
      clearInterval(checkPasswordInterval)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                {windowWidth > 450 && <Carrossel />}
                <Steps/>
                {!isAuthenticated && <Lock />}
              </>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
