import React, { useState, useEffect } from "react";
import "./StockFusionPageStyle.css";

function ReactStore() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Sorting state
  const [sort, setSort] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Product Preview modal
  const [previewProduct, setPreviewProduct] = useState(null);

  // Dark/Light theme
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.log("Error:", err));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = () => {
    if (!title || !price || !imageURL) {
      alert("All fields are required");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      title: title,
      price: parseFloat(price),
      image: imageURL,
    };

    setProducts([...products, newProduct]);
    setTitle("");
    setImageURL("");
    setPrice("");
  };

  const updateProduct = () => {
    const updated = products
      .map((item) =>
        item.id === editId
          ? { ...item, title, price, image: imageURL ? imageURL : item.image }
          : item
      )
      .map((item, index) => ({ ...item, id: index + 1 }));

    setProducts(updated);
    setEditId(null);
    setTitle("");
    setPrice("");
    setImageURL("");
  };

  const deleteProduct = (id) => {
    const updated = products
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, id: index + 1 }));
    setProducts(updated);
  };

  // Sorting logic
  const sortProducts = (items) => {
    if (sort === "price-low")
      return [...items].sort((a, b) => a.price - b.price);
    if (sort === "price-high")
      return [...items].sort((a, b) => b.price - a.price);
    if (sort === "name-az")
      return [...items].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name-za")
      return [...items].sort((a, b) => b.title.localeCompare(a.title));
    return items;
  };

  const filteredProducts = sortProducts(
    products.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const pageProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={`App ${dark ? "dark" : ""}`}>
      <div className="theme-toggle">
        <button onClick={() => setDark(!dark)}>
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <h2>🛒 Stock Fusion 🛍️</h2>

      <div className="badge-container">
        <span className="badge">{products.length} items</span>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sort-container">
        <select onChange={(e) => setSort(e.target.value)} className="dropdown">
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A-Z</option>
          <option value="name-za">Name: Z-A</option>
        </select>
      </div>

      <div className="form-section glass center-form">
        <input
          type="text"
          placeholder="Enter product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {editId ? (
          <button className="update-btn" onClick={updateProduct}>
            Update
          </button>
        ) : (
          <button className="add-btn" onClick={addProduct}>
            Add
          </button>
        )}
      </div>

      {/* Table */}
      <table className="table-modern">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pageProducts.map((item) => (
            <tr key={item.id} className="row-hover">
              <td>{item.id}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() => setPreviewProduct(item)}
                  className="preview-img"
                />
              </td>
              <td>{item.title}</td>
              <td className="price">₹ {Number(item.price).toFixed(2)}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditId(item.id);
                    setTitle(item.title);
                    setPrice(item.price);
                    setImageURL(item.image);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-section">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ⬅ Prev
        </button>
        <span>
          Page <b>{currentPage}</b> of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ➡
        </button>
      </div>

      {/* Preview Modal */}
      {/* Preview Modal */}
      {previewProduct && (
        <div
          className="preview-modal-overlay"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="preview-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewProduct.image} alt={previewProduct.title} />
            <h3>{previewProduct.title}</h3>
            <h4>₹ {previewProduct.price}</h4>

            <button
              className="close-preview"
              onClick={() => setPreviewProduct(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReactStore;
