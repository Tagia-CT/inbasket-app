import { useState, useEffect } from "react";
import { db, auth } from "./config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndFetch = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists() || userSnap.data().role !== "admin") {
        alert("Akses ditolak!");
        navigate("/dashboard");
        return;
      }
      await fetchAllUsers();
      setLoading(false);
    };
    verifyAndFetch();
  }, []);

  const fetchAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setAllUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditField = async (userId, fieldName, currentTime) => {
    const newValue = prompt(`Masukkan ${fieldName} baru:`, currentTime || "");
    if (newValue !== null) {
      try {
        await updateDoc(doc(db, "users", userId), { [fieldName]: newValue });
        fetchAllUsers();
      } catch (error) {
        alert("Gagal update: " + error.message);
      }
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Memuat Data User...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Panel Manajemen User</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", cursor: "pointer" }}>Kembali</button>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "center" }}>
          <thead>
            <tr style={{ backgroundColor: "#333", color: "white" }}>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Username</th>
              <th style={{ padding: "12px" }}>Full Name</th>
              <th style={{ padding: "12px" }}>Bio</th>
              <th style={{ padding: "12px" }}>Role</th>
              <th style={{ padding: "12px" }}>Opsi Kendali</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(u => (
              <tr key={u.id}>
                <td style={{ padding: "10px", backgroundColor: "#908b8b" }}>{u.email}</td>
                <td style={{ padding: "10px" }}>
                  {u.username || "-"} <br/>
                  <button onClick={() => handleEditField(u.id, "username", u.username)} style={{ fontSize: "10px", marginTop: "5px" }}>Edit</button>
                </td>
                <td style={{ padding: "10px" }}>
                  {u.fullName || "-"} <br/>
                  <button onClick={() => handleEditField(u.id, "fullName", u.fullName)} style={{ fontSize: "10px", marginTop: "5px" }}>Edit</button>
                </td>
                <td style={{ padding: "10px", maxWidth: "250px", wordWrap: "break-word" }}>
                  {u.bio || "-"} <br/>
                  <button onClick={() => handleEditField(u.id, "bio", u.bio)} style={{ fontSize: "10px", marginTop: "5px" }}>Edit</button>
                </td>
                <td style={{ padding: "10px" }}>
                   <span style={{ fontWeight: u.role === "admin" ? "bold" : "normal", color: u.role === "admin" ? "purple" : "black" }}>
                    {u.role}
                   </span>
                </td>
                <td style={{ padding: "10px" }}>
                  {u.id !== auth.currentUser.uid ? (
                    <button 
                      onClick={async () => {
                        if(window.confirm(`Hapus akun ${u.email} secara permanen?`)) {
                          await deleteDoc(doc(db, "users", u.id));
                          fetchAllUsers();
                        }
                      }} 
                      style={{ color: "white", backgroundColor: "red", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Hapus Akun
                    </button>
                  ) : (
                    <span style={{ fontSize: "11px", color: "gray" }}>Akun Anda (Aktif)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;