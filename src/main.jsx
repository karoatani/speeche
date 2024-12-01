import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Write from "./components/Write.jsx";
import Home from "./components/Home";
import Imports from "./components/Imports";
import MyCreations from "./components/MyCreations";
import Settings from "./components/Settings";

// Define router with nested routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "imports", 
        element: <Imports />,
      },
      {
        path: "home", 
        element: <Home />,
      },
      {
        path: "write", 
        element: <Write />,
      },
      {
        path: "my-creations", 
        element: <MyCreations />,
      },
      {
        path: "settings", 
        element: <Settings />,
      },
      
    ],
  },
]);

// Create a query client instance for react-query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer position="bottom-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
