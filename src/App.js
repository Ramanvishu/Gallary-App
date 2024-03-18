import "./index.css";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import StarredImages from "./components/StarredImages";
import "./App.css";

const API_URL = "https://api.unsplash.com/search/photos?";
const IMAGES_PER_PAGE = 20;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [starredImages, setStarredImages] = useState([]);

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setError("");
        const { data } = await axios.get(
          `${API_URL}query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setError("Something Went Wrong!!");
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [page, fetchImages]);

  const handleInputChange = () => {
    if (searchInput.current.value === "") {
      setImages([]);
    }
  };

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };
  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (Selection) => {
    searchInput.current.value = Selection;
    resetSearch();
  };

  const toggleStarred = (id) => {
    const index = starredImages.indexOf(id);
    if (index === -1) {
      setStarredImages([...starredImages, id]);
    } else {
      const updatedStarredImages = [...starredImages];
      updatedStarredImages.splice(index, 1);
      setStarredImages(updatedStarredImages);
    }
  };

  return (
    <Router>
      <div className="container">
        <div className="filters">
          <Link to="/starred">★</Link>
        </div>
        <h1 className="title">Gallery App</h1>
        {error && <p className="error-msg">{error}</p>}
        <div className="search-section">
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search for Images..."
              className="search-input"
              ref={searchInput}
              onChange={handleInputChange}
            />
          </Form>
        </div>
        <div className="filters">
          <div onClick={() => handleSelection("night")}>Night</div>
          <div onClick={() => handleSelection("cars")}>Cars</div>
          <div onClick={() => handleSelection("cats")}>Cats</div>
          <div onClick={() => handleSelection("moon")}>Moon</div>
        </div>
        <div className="images">
          {images.map((image) => (
            <div key={image.id} className="image-container">
              <img
                src={image.urls.small}
                alt={image.alt_description}
                className="image"
              />
              <button
                className="star-button"
                onClick={() => toggleStarred(image.id)}
              >
                {starredImages.includes(image.id) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>
        <div className="filters">
          {images.length > 0 && page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}{" "}
          {images.length > 0 && page < totalPages && (
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          )}
        </div>
      </div>
      <Routes>
        <Route
          path="/starred"
          element={
            <StarredImages
              starredImages={starredImages}
              toggleStarred={toggleStarred}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
