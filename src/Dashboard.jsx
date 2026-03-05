import { useState, useEffect } from "react";
import { auth, db } from "./config/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState("user"); // State untuk menyimpan peran user
  const currentUser = auth.currentUser;

  // Gabungkan pengambilan Role dan Posts dalam satu useEffect agar lebih efisien
  useEffect(() => {
    const initializeDashboard = async () => {
      if (currentUser) {
        // 1. Ambil Peran User dari Firestore
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
      }
      // 2. Ambil Feed Postingan
      fetchPosts();
    };

    initializeDashboard();
  }, [currentUser]);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetch posts:", error);
    }
  };

  const handleDelete = async (postId, uploaderId) => {
    const isAdmin = userRole === "admin";
    const isOwner = currentUser.uid === uploaderId;

    if (!isAdmin && !isOwner) {
      return alert("Hanya Admin atau Pemilik yang bisa menghapus foto ini!");
    }

    if (window.confirm(isAdmin ? "ADMIN: Hapus foto user ini?" : "Hapus foto kamu?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        fetchPosts();
      } catch (error) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* NAVIGATION BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h2 style={{ color: "#333" }}>In-Basket Feed</h2>
        <div>
          <button onClick={() => navigate("/upload")} style={{ marginRight: "10px", backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>+ Posting</button>
          <button onClick={() => signOut(auth).then(() => navigate("/"))} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Tombol Profil (Bisa dilihat semua orang) */}
        <button onClick={() => navigate("/profile")} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #3a579a", cursor: "pointer", backgroundColor: "white" }}>
          Lihat Profil & Info User
        </button>

        {/* TOMBOL ADMIN PANEL (Hanya muncul jika userRole === "admin") */}
        {userRole === "admin" && (
          <button 
            onClick={() => navigate("/admin")} 
            style={{ 
              padding: "12px", 
              borderRadius: "8px", 
              border: "none", 
              backgroundColor: "#6f42c1", 
              color: "white", 
              fontWeight: "bold",
              cursor: "pointer" 
            }}
          >
            Admin Panel
          </button>
        )}
      </div>

      <hr style={{ margin: "25px 0", border: "0.5px solid #eee" }} />

      {/* FEED LIST */}
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>Belum ada kiriman.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ marginBottom: "30px", border: "1px solid #efefef", borderRadius: "8px", overflow: "hidden", backgroundColor: "white" }}>
            <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa" }}>
              <strong>@{post.uploaderUsername || "anonim"}</strong>
              {(currentUser.uid === post.uploaderId || userRole === "admin") && (
                <button 
                  onClick={() => handleDelete(post.id, post.uploaderId)} 
                  style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  HAPUS {userRole === "admin" && currentUser.uid !== post.uploaderId && "(ADMIN)"}
                </button>
              )}
            </div>
            <img src={post.imageUrl} alt="post" style={{ width: "100%", display: "block", minHeight: "200px", backgroundColor: "#f0f0f0" }} />
            <div style={{ padding: "12px", color: "gray", fontSize: "11px", borderTop: "1px solid #efefef" }}>
              {new Date(post.createdAt).toLocaleString("id-ID")}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;