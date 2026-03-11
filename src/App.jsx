import { BrowserRouter } from "react-router-dom"
import { AppProvider } from "./components/itemContext/AppProvider"
import AppRouter from "./router/AppRouter"
function App() {

  return (
    <>
       <BrowserRouter>
          <AppProvider>
          <AppRouter/>
          </AppProvider>
       </BrowserRouter>
    </>
  )
}

export default App
