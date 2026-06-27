import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import GameDetail from "@/pages/GameDetail";
import Scan from "@/pages/Scan";
import Cloud from "@/pages/Cloud";
import Settings from "@/pages/Settings";
import Community from "@/pages/Community";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/game/:id" element={<GameDetail />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/cloud" element={<Cloud />} />
      <Route path="/community" element={<Community />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
