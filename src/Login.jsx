import { useState } from "react";
import { auth } from "./config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mencocokkan data ke Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Jika cocok, langsung arahkan ke Dashboard (Flow 3)
      navigate("/dashboard"); 
    } catch (error) {
      alert("Login Gagal: Periksa kembali email dan password kamu.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login In-Basket</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Login</button>
      </form>
      <br />
      <p>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </div>
  );
}

export default Login;