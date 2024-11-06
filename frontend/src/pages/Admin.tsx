import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

// Define a product interface
interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  sku: string;
  category: string;
  subCategory: string;
  sizeOptions: string[];
  isReturnable: boolean;
  bashProductUUID: string;
  productCode: string;
  soldBy: string;
  images?: string[];
}

const AdminPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);

  // Helper function to generate unique SKU
  const generateSKU = () => {
    return `SKU-${Math.floor(Math.random() * 1000000)}`;
  };

  // Helper function to generate a UUID
  const generateUUID = () => {
    return `${Math.floor(Math.random() * 1000000000000)}`;
  };

  // Helper function to generate product code
  const generateProductCode = () => {
    return `dash-${Math.floor(Math.random() * 1000000000000)}`;
  };

  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    brand: "",
    price: 0,
    description: "",
    sku: generateSKU(),
    category: "All",
    subCategory: "",
    sizeOptions: [],
    isReturnable: false,
    bashProductUUID: generateUUID(),
    productCode: generateProductCode(),
    soldBy: "",
    images: [],
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [fieldName]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [fieldName]: value,
      });
    }
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedSizeOptions = [...newProduct.sizeOptions];
    updatedSizeOptions[index] = e.target.value;
    setNewProduct({
      ...newProduct,
      sizeOptions: updatedSizeOptions,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedImages = [...newProduct.images!];
    updatedImages[index] = e.target.value;
    setNewProduct({
      ...newProduct,
      images: updatedImages,
    });
  };

  const addSizeField = () => {
    setNewProduct({
      ...newProduct,
      sizeOptions: [...newProduct.sizeOptions, ""],
    });
  };

  const addImageField = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images!, ""],
    });
  };

  const handleAddProduct = () => {
    dispatch(addProduct(newProduct));
    setNewProduct({
      name: "",
      brand: "",
      price: 0,
      description: "",
      sku: generateSKU(),
      category: "All",
      subCategory: "",
      sizeOptions: [],
      isReturnable: false,
      bashProductUUID: generateUUID(),
      productCode: generateProductCode(),
      soldBy: "",
      images: [],
    });
  };

  const handleUpdateProduct = (product: Product) => {
    if (product.id) {
      dispatch(updateProduct(product.id, product));
      setEditingProduct(null);
    } else {
      alert("Product ID is missing");
    }
  };

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const categories = [
    "All",
    "Women",
    "Men",
    "Sports",
    "Home",
    "Kids",
    "Beauty",
    "Jewelry",
    "Technology",
    "Deals",
    "Sale",
    "Black Friday",
  ];

  const sizeOptions = ["Small", "Medium", "Large", "Extra Large"];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Product Management</h1>

      {/* Product Form */}
      <div className="container mb-4 col-sm-8 align-content-center">
        <div className="card-body">
          {/* Display Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          <h5 className="card-title">
            {editingProduct ? "Update Product" : "Add New Product"}
          </h5>

          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={editingProduct ? editingProduct.name : newProduct.name}
                required
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                name="brand"
                value={editingProduct ? editingProduct.brand : newProduct.brand}
                onChange={(e) => handleInputChange(e, "brand")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => handleInputChange(e, "price")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={
                  editingProduct
                    ? editingProduct.description
                    : newProduct.description
                }
                onChange={(e) => handleInputChange(e, "description")}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-control"
                name="sku"
                value={editingProduct ? editingProduct.sku : newProduct.sku}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={
                  editingProduct ? editingProduct.category : newProduct.category
                }
                onChange={(e) => handleInputChange(e, "category")}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Sub-Category</label>
              <input
                type="text"
                className="form-control"
                name="subCategory"
                value={
                  editingProduct
                    ? editingProduct.subCategory
                    : newProduct.subCategory
                }
                onChange={(e) => handleInputChange(e, "subCategory")}
              />
            </div>

            {/* Size Options */}
            <div className="mb-3">
              <label className="form-label">Size Options</label>
              {newProduct.sizeOptions.map((size, index) => (
                <div className="input-group mb-2" key={index}>
                  <select
                    className="form-select"
                    value={size}
                    onChange={(e) => handleSizeChange(e, index)}
                  >
                    {sizeOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-primary ms-2 rounded-5"
                onClick={addSizeField}
              >
                Add Size Option
              </button>
            </div>

            {/* Images */}
            <div className="mb-3">
              <label className="form-label">Product Images</label>
              {newProduct.images?.map((image, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-primary ms-2 rounded-5"
                onClick={addImageField}
              >
                Add Image
              </button>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isReturnable"
                checked={newProduct.isReturnable}
                onChange={() =>
                  setNewProduct({
                    ...newProduct,
                    isReturnable: !newProduct.isReturnable,
                  })
                }
              />
              <label className="form-check-label" htmlFor="isReturnable">
                Is Returnable?
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Dash Product UUID</label>
              <input
                type="text"
                className="form-control"
                name="bashProductUUID"
                value={
                  editingProduct
                    ? editingProduct.bashProductUUID
                    : newProduct.bashProductUUID
                }
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Product Code</label>
              <input
                type="text"
                className="form-control"
                name="productCode"
                value={
                  editingProduct
                    ? editingProduct.productCode
                    : newProduct.productCode
                }
                onChange={(e) => handleInputChange(e, "productCode")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sold By</label>
              <input
                type="text"
                className="form-control"
                name="soldBy"
                value={
                  editingProduct ? editingProduct.soldBy : newProduct.soldBy
                }
                onChange={(e) => handleInputChange(e, "soldBy")}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-5"
              onClick={
                editingProduct
                  ? () => handleUpdateProduct(editingProduct)
                  : handleAddProduct
              }
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Product List</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>${product.price}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id as string)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
