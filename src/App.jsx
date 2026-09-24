import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";

//This file is for placing links to pages

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route> 
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/" element={<Home />}></Route> 
        </Routes>
        </main>
    );
}

export default App;