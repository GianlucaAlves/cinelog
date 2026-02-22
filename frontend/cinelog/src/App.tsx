import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Store from "./pages/Store";
import MovieDetail from "./pages/MovieDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/store" element={<Store />} />
      <Route path="/movie/:tmdbId" element={<MovieDetail />} />
    </Routes>
  );
}

export default App;
