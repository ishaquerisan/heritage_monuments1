import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Gallery = () => {
  const [data, setData] = useState([]);
  const { id } = useParams(); // Get the id parameter from the URL

  useEffect(() => {
    axios
      .get(`http://localhost:3001/gallery/${id}`) // Use the id from the URL
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]); // Include id in the dependency array

  function deleteGallery(id) {
    axios
      .delete(`http://localhost:3001/gallery/${id}`)
      .then((res) => {
        setData((currentData) =>
          currentData.filter((gallery) => gallery._id !== id)
        ); // Use !== for comparison
      })
      .catch((err) => {
        alert("Delete Error: Could not be deleted");
      });
  }

  return (
    <>
      <div className="topbar">
        <Link to={"/monument/create"}>
          <button className="btn">Create</button>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Short Description</th>
            <th>Media</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map((gallery, index) => (
            <tr key={gallery._id}>
              <td>{index + 1}</td>
              <td>{gallery.imgTitle}</td>
              <td>{gallery.description}</td>
              <td>
                {/* Display image or video based on file type */}
                {gallery.image && gallery.image.endsWith(".mp4") ? (
                  <video width="320" height="240" controls>
                    <source src={gallery.image} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={gallery.image} alt="Gallery Media" />
                )}
              </td>
              <td>
                
                <Link to={`/monument/edit/${gallery._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteGallery(gallery._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Gallery;
