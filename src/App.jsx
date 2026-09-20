import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />}></Route> 
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/home" element={<Home />}></Route> 
        </Routes>
        </main>
    );
}

export default App;