import React from "react";
import { Route, Routes } from "react-router-dom";
import ArtistMain from "../pages/Artist/ArtistMain";
import ArtistDetail from "../pages/Artist/ArtistDetail/ArtistDetail";

function ArtistRouter() {
  return (
    <Routes>
      <Route index element={<ArtistMain />} />
      <Route path=":artistProfileId" element={<ArtistDetail />} />
    </Routes>
  );
}

export default ArtistRouter;
