import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GymPlan from "./pages/Gengymplan";
import ProfileEdit from "./pages/ProfileEdit";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectRoute";
import VerifyEmail from "./pages/VerifyEmail";
import AiGymPlan from "./pages/Aigymplan";
import MyPlans from "./pages/MyPlans";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import NutritionPlan from "./pages/Gennutritionplan";
import AiNutritionPlan from "./pages/Ainutritionplan";
import ProfileSecurity from "./pages/ProfileSecurity";


//This file is for placing links to pages

function App(){
    return(
        <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="*" element={<Navigate to="/" replace/>}></Route> 
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>}></Route>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>}></Route>
          <Route path="/verify-email" element={<VerifyEmail />}></Route>
          <Route path="/passwords/reset" element={<RequestReset />}></Route>
          <Route path="/passwords/resetpassword" element={<ResetPassword />}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
          <Route path="/gymplan" element={<ProtectedRoute><GymPlan /></ProtectedRoute>}></Route>
          <Route path="profile">
            <Route index element={<Navigate to="edit" replace/>}></Route>
            <Route path="edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>}></Route>
            <Route path="security" element={<ProtectedRoute><ProfileSecurity/></ProtectedRoute>}></Route>
          </Route>
          <Route path="/aigymplan/:id" element={<ProtectedRoute><AiGymPlan /></ProtectedRoute>}></Route>
          <Route path="/myplans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>}></Route>
          <Route path="/nutritionplan" element={<ProtectedRoute><NutritionPlan /></ProtectedRoute>}></Route>
          <Route path="/ainutritionplan/:id" element={<ProtectedRoute><AiNutritionPlan /></ProtectedRoute>}></Route>

       </Routes>
        </main>
    );
}

export default App;