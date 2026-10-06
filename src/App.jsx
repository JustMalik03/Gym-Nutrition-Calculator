import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectRoute";
import ProfileSettings from "./pages/ProfileSettings";

//This file is for placing links to pages

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}></Route> 
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>}></Route>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
          <Route path="/settings" element={<ProtectedRoute><ProfileSettings/></ProtectedRoute>}></Route>
        </Routes>
        </main>
    );
}

export default App;