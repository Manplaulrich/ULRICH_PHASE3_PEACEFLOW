import { BrowserRouter } from "react-router-dom"
import Homepage from "./components/Homepage"
import AppRouter from "./lib/AppRouter"
function App() {

  return (
    <>
       <BrowserRouter>
         <AppRouter/>
       </BrowserRouter>
    </>
  )
}

export default App
