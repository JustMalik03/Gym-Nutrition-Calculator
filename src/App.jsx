import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GymPlan from "./pages/Gengymplan";
import Profile from "./pages/Profile";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectRoute";
import VerifyEmail from "./pages/VerifyEmail";
import AiPlan from "./pages/Aiplan";
import MyPlans from "./pages/MyPlans";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";


//This file is for placing links to pages

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}></Route> 
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>}></Route>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>}></Route>
          <Route path="/verify-email" element={<VerifyEmail />}></Route>
          <Route path="/passwords/reset" element={<RequestReset />}></Route>
          <Route path="/passwords/resetpassword" element={<ResetPassword />}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
          <Route path="/gymplan" element={<ProtectedRoute><GymPlan /></ProtectedRoute>}></Route>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
          <Route path="/aiplan/:id" element={<ProtectedRoute><AiPlan /></ProtectedRoute>}></Route>
          <Route path="/myplans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>}></Route>

       </Routes>
        </main>
    );
}

export default App;