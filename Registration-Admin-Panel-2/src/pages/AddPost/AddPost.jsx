import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./add-post.scss";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { alignProperty } from "@mui/material/styles/cssUtils";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  const navigate = useNavigate();

  const formHandler = async (e) => {
    e.preventDefault();

    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    const imGW = await getDownloadURL(imageRef);
    let obj = { title, description, image };

    await addDoc(collection(db, "Added-Post"), {
      description: obj.description,
      title: obj.title,
      image: imGW,
    })
      .then((res) => {
        alert("Post added");
      })
      .catch((err) => {
        alert("post cant be added");
      });

    console.log(obj);
    setTitle("");
    setDescription("");
    setImage("");
    navigate("/");
  };

  return (
    <div className="side">
      <Sidebar />
      <div className="nav">
        <Navbar />
        <div className="postForm">
          <h2>Add Post</h2>
          <form>
            <input
              className="credentialField"
              type="text"
              id="postTitle"
              name="postTitle"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
            <br />
            <textarea
              required
              placeholder="Enter your Description"
              id="descripton"
              cols={30}
              rows={8}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
            <br />
            <input
              type="file"
              id="file"
              className="file"
              onChange={(e) => {
                setImageUpload(e.target.files[0]);
              }}
            />           
            <br />
            <input type="submit" value="Add Post" className="btnPost" />
          </form>
        </div>
      </div>
    </div>
    // {/* <form onSubmit={formHandler}>
    //   <div className="postBox">
    //     <label htmlFor="postTitle">
    //       Enter Title <br />
    //       <input
    //         type="text"
    //         id="postTitle"
    //         placeholder="Post title"
    //         name="postTitle"
    //         onChange={(e) => setTitle(e.target.value)}
    //         value={title}
    //         required
    //       />
    //     </label>
    //     <label htmlFor="descripton">
    //       Enter Description
    //       <br />
    //       <textarea
    //         required
    //         id="descripton"
    //         placeholder="Enter Description"
    //         onChange={(e) => setDescription(e.target.value)}
    //         value={description}
    //       ></textarea>
    //     </label>
    //   </div>
    //   <div className="uploadImgBox">
    //     <input type="file" id="file" onChange={(e) => { setImageUpload(e.target.files[0]) }} />
    //     <label htmlFor="file" className="btn-2"  >
    //       Upload Image
    //     </label>
    //   </div>
    //   <button>Add post</button>
    // </form> */}
  );
};

export default AddPost;

export const icon = () => {
  return <CloudUploadIcon />;
};
