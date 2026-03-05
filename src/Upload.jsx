import { useState } from "react";
import { auth, db } from "./config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const currentUser = auth.currentUser;

  const handleUpload = async () => {
    if (!imageFile) return alert("Pilih foto terlebih dahulu!");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message);

      await addDoc(collection(db, "posts"), {
        imageUrl: data.secure_url,
        uploaderUsername: currentUser.email.split('@')[0],
        uploaderId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });

      alert("Berhasil diunggah!");
      navigate("/dashboard"); // Otomatis balik ke Dashboard setelah sukses
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
      <h3>Unggah Foto Baru</h3>
      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload} disabled={isUploading} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>
        {isUploading ? "Memproses..." : "Terbitkan Postingan"}
      </button>
      <button onClick={() => navigate("/dashboard")} style={{ width: "100%", marginTop: "10px", background: "none", border: "none", color: "gray", cursor: "pointer" }}>
        Batal
      </button>
    </div>
  );
}

export default Upload;