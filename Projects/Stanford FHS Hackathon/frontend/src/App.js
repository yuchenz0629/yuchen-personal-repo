import SignIn from "./pages/signin_page/signin";
import SignUp from "./pages/signup_page/signup";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import BuyerDashboard from "./pages/dashboards/BuyerDashboard";
import BuyerSidebar from "./components/layout/BuyerSidebar";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import { Listings } from "./pages/listings";
import SellerSidebar from "./components/layout/SellerSidebar";
import TopBar from "./components/layout/TopBar";
import { CreateListing } from "./pages/listings/create";
import "react-toastify/dist/ReactToastify.css";
import FshDashboard from "./pages/dashboards/FshDashboard";
import FshSidebar from "./components/layout/FshSidebar";
import Search from "./pages/listings/search";
import Saved from "./pages/listings/saved";
import BuyerWorkflow from "./pages/workflows/buyer_workflow";
import Messages from "./pages/messages/messages";

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const ProtectedRoute = ({ children }) => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

const AuthenticatedLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {localStorage.getItem("role") === "Seller" ? (
        <SellerSidebar />
      ) : localStorage.getItem("role") === "Buyer" ? (
        <BuyerSidebar />
      ) : (
        <FshSidebar />
      )}
      <div className="flex-1">
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                localStorage.getItem("role") === "Seller" ? (
                  <SellerDashboard />
                ) : localStorage.getItem("role") === "Buyer" ? (
                  <BuyerDashboard />
                ) : (
                  <FshDashboard />
                )
              }
            />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/create" element={<CreateListing />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/tasks" element={<BuyerWorkflow />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
