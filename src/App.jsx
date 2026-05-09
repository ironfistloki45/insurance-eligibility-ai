import { useState } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  )

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  if (!token) {
    return <Login setToken={handleSetToken} />
  }

  return (
    <Dashboard
      token={token}
      setToken={setToken}
    />
  )
}

export default App