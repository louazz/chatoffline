
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Send from "./pages/Send.jsx"
import Chat from "./pages/Chat.jsx"
import Ips from "./pages/Ips.jsx"

import { HashRouter } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
 <HashRouter>
        <Routes>
          <Route index element={<Signup/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path="send" element={<Send/>}/>
          <Route path="chat" element={<Chat/>}/>
          <Route path="ip" element={<Ips/>} />
        </Routes>
     </HashRouter>
    </>
  )
}

export default App

