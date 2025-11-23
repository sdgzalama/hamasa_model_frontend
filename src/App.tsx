import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import MediaItems from "./pages/MediaItems";
import ProjectAnalytics from "./pages/ProjectAnalytics";

import CreateClient from "./pages/CreateClient";
import CreateProject from "./pages/CreateProject";
import CreateMediaSource from "./pages/CreateMediaSource";

import ThemesHome from "./pages/ThemesHome";  // SELECT PROJECT
import Themes from "./pages/Themes";       // EDIT THEMES

import MediaItemDetail from "./pages/MediaItemDetail";
                                             
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/media" element={<MediaItems />} />
        <Route path="/analytics/:id" element={<ProjectAnalytics />} />
        <Route path="/clients/new" element={<CreateClient />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/add-media-source" element={<CreateMediaSource />} />

        {/* THEMES */}
        <Route path="/themes" element={<ThemesHome />} />
        <Route path="/themes/:id" element={<Themes />} />

        {/* media item detail */}
        <Route path="/media-item/:id" element={<MediaItemDetail />} />

      </Routes>
    </BrowserRouter>
  );
}
