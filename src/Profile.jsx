import { useState, useEffect } from "react";
import { auth, db } from "./config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // State untuk form
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data profil saat halaman dibuka
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
          setFullName(data.fullName || "");
          setBio(data.bio || "");
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (!username || !fullName) return alert("Username dan Nama Lengkap wajib diisi!");
    
    try {
      const docRef = doc(db, "users", user.uid);
      
      // Menggunakan setDoc dengan { merge: true } agar jika dokumen belum ada, 
      // dia akan membuatnya. Jika sudah ada, hanya mengupdate kolom yang diisi.
      await setDoc(docRef, {
        email: user.email, // Email tetap disimpan tapi tidak bisa diedit user di form
        username: username,
        fullName: fullName,
        bio: bio,
        role: "user", // Default role saat melengkapi profil
        updatedAt: new Date().toISOString()
      }, { merge: true });

      alert("Profil berhasil diperbarui!");
      navigate("/dashboard");
    } catch (error) {
      alert("Gagal menyimpan profil: " + error.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Memuat data...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
      <h2 style={{ textAlign: "center" }}>Info User & Edit Profil</h2>
      
      <div style={{ marginBottom: "15px" }}>
        <label>Email (Tidak bisa diganti):</label>
        <input 
          type="text" 
          value={user?.email} 
          disabled 
          style={{ width: "100%", padding: "10px", marginTop: "5px", backgroundColor: "#eee", border: "1px solid #ccc" }} 
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Username:</label>
        <input 
          type="text" 
          placeholder="Masukan username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }} 
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Nama Lengkap:</label>
        <input 
          type="text" 
          placeholder="Nama asli Anda"
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }} 
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Bio:</label>
        <textarea 
          placeholder="Ceritakan sedikit tentang dirimu..."
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "5px", height: "80px" }} 
        />
      </div>

      <button 
        onClick={handleSave} 
        style={{ width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
      >
        Simpan Profil
      </button>

      <button 
        onClick={() => navigate("/dashboard")} 
        style={{ width: "100%", marginTop: "10px", background: "none", border: "none", color: "gray", cursor: "pointer" }}
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
}

export default Profile;