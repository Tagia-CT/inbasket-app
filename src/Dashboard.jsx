import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Meminta Firebase untuk mengeluarkan sesi user
    await signOut(auth);
    // Lempar kembali ke halaman Login
    navigate("/"); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Selamat Datang di Dashboard! 🎉</h2>
      <p>Kamu berhasil masuk dengan akun: <strong>{auth.currentUser?.email}</strong></p>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;