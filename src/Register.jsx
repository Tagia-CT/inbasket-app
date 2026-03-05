import { useState } from "react";
import { auth } from "./config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Akun berhasil dibuat! Silakan login.");
      // Setelah daftar, arahkan kembali ke halaman Login (Flow 1)
      navigate("/"); 
    } catch (error) {
      alert("Gagal: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pendaftaran Akun Baru</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Daftar Sekarang</button>
      </form>
      <br />
      <p>Sudah punya akun? <Link to="/">Login di sini</Link></p>
    </div>
  );
}

export default Register;