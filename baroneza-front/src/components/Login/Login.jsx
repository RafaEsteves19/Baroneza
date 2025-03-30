import { useState, useEffect } from "react"
import axios from "axios"
import "./Login.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"

let password = false

const Login = () => {
  const [inputPassword, setInputPassword] = useState("")
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isPasswordCorrect) {
      const redirectTimer = setTimeout(() => {
        navigate("/")
      }, 2000)

      return () => clearTimeout(redirectTimer)
    }
  }, [isPasswordCorrect, navigate])

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/verify-password", { password: inputPassword })

      if (response.data.success) {
        setIsPasswordCorrect(true)
        password = true
        toast.success("Senha correta!")
      } else {
        setIsPasswordCorrect(false)
        password = false
        toast.error("Senha incorreta")
      }
    } catch (error) {
      setIsPasswordCorrect(false)
      password = false
      toast.error("Senha incorreta")
    }
  }

  const handlePasswordChange = (e) => {
    setInputPassword(e.target.value)
  }

  const handleExit = () => {
    navigate("/")
  }

  return (
    <div className="password-lock-container">
      <form onSubmit={handlePasswordSubmit} className="password-form">
        <h5>Esta área é exclusiva para administração, por favor, evite o acesso!</h5>
        <input
          type="password"
          placeholder="Digite a senha"
          value={inputPassword}
          onChange={handlePasswordChange}
          required
          className="password-input"
        />
        <button type="submit" className="submit-button">
          Verificar
        </button>
      </form>

      <button onClick={handleExit} className="exit-button">
        Sair
      </button>

      <ToastContainer />
    </div>
  )
}

export { password }
export default Login

