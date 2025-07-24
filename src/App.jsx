// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "./components/layout/Mainlayout";
import StatCard from "@/components/common/StatCard.jsx";

const App = () => {
  return (
    <SidebarProvider>
      <MainLayout noScroll >
          <StatCard></StatCard>
      </MainLayout>
    </SidebarProvider>
  );
};

export default App;
