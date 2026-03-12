import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Upload from "./Upload";
import Profile from "./Profile";
import AdminPanel from "./AdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTE PUBLIK */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RUTE TERPROTEKSI (Sistem Induk) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
