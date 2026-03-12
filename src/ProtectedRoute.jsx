import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom"; // 1. Tambahkan Outlet
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute() { // 2. Hapus { children }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memantau apakah ada user yang sedang login
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Selesai mengecek
    });
    return unsubscribe;
  }, []);

  // Tampilkan teks tunggu selama proses pengecekan ke Firebase
  if (loading) {
    return <div style={{ padding: "20px" }}>Memeriksa akses keamanan...</div>;
  }

  // Jika tidak ada user (belum login), lempar paksa ke halaman Login "/"
  if (!user) {
    return <Navigate to="/" />;
  }

  // 3. Jika aman, persilakan masuk ke komponen tujuan melalui Outlet
  return <Outlet />;
}

export default ProtectedRoute;
