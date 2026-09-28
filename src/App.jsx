import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GuestRoute from "./components/GuestRoute";

//This file is for placing links to pages

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}></Route> 
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>}></Route>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
        </main>
    );
}

export default App;