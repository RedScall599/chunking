import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import "./style/Frontpage.css";
import App from "./App.jsx";

// 1️⃣ Create a QueryClient instance
const queryClient = new QueryClient();

// 2️⃣ Wrap your entire app in QueryClientProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
