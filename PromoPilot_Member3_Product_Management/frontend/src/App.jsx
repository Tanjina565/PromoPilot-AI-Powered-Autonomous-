import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/products";
const emptyForm = {
  name: "", description: "", price: "", category: "", image: "", stock: true
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error();
      setProducts(data);
    } catch {
      setMessage("Could not connect to the backend. Check that the server is running.");
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not save product.");

      setMessage(editId ? "Product updated." : "Product added.");
      setForm({ ...emptyForm });
      setEditId(null);
      await loadProducts();
    } catch (error) {
      setMessage(error.message || "Could not save product.");
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock !== false
    });
    setEditId(product._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not delete product.");
      setMessage("Product deleted.");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch(`${API}/import`, { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "CSV import failed.");
      setMessage(result.message);
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      event.target.value = "";
    }
  }

  function cancelEdit() {
    setForm({ ...emptyForm });
    setEditId(null);
    setMessage("");
  }

  return (
    <main className="container">
      <h1>Product Management</h1>
      <p className="intro">Add, update and manage store products.</p>

      {message && <p className="message">{message}</p>}

      <section className="form-card">
        <h2>{editId ? "Update Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Product name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description}
              onChange={handleChange} rows="3" />
          </label>

          <div className="two-columns">
            <label>
              Price
              <input name="price" type="number" min="0" step="0.01"
                value={form.price} onChange={handleChange} required />
            </label>
            <label>
              Category
              <input name="category" value={form.category}
                onChange={handleChange} required />
            </label>
          </div>

          <label>
            Image URL (optional)
            <input name="image" type="url" value={form.image}
              onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </label>

          <label className="stock-option">
            <input name="stock" type="checkbox" checked={form.stock}
              onChange={handleChange} />
            In stock
          </label>

          <div className="form-buttons">
            <button type="submit">{editId ? "Save Changes" : "Add Product"}</button>
            {editId && <button type="button" className="secondary" onClick={cancelEdit}>
              Cancel
            </button>}
          </div>
        </form>
      </section>

      <section className="list-heading">
        <div>
          <h2>Products</h2>
          <p>{products.length} product(s)</p>
        </div>
        <label className="csv-upload">
          Import CSV
          <input type="file" accept=".csv,text/csv" onChange={importCSV} />
        </label>
      </section>

      {products.length === 0 ? (
        <p className="empty">No products yet. Add one using the form above.</p>
      ) : (
        <section className="products">
          {products.map((product) => (
            <article className="product-card" key={product._id}>
              {product.image
                ? <img src={product.image} alt={product.name} />
                : <div className="no-image">No image</div>}

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description || "No description"}</p>
                <p>Category: {product.category}</p>
                <p className="price">৳{product.price}</p>
                <p className={product.stock ? "in-stock" : "out-stock"}>
                  {product.stock ? "In stock" : "Out of stock"}
                </p>
                <div className="card-buttons">
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button className="delete" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
