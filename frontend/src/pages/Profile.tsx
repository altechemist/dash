import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { removeFromWishlist, updateProfile } from "../store/userSlice";
import { fetchAllOrders } from "../store/orderSlice";


function Profile() {
  const { user } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.product);
  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // State for editing profile
  const [username, setUsername] = useState(user?.username || "");
  const [addresses, setAddresses] = useState(user?.addresses.join(", ") || "");
  const [isEditing, setIsEditing] = useState(false);

  
  // Filter products in the user's wishlist
  const favoriteProducts = products.filter((product) =>
    user?.wishlist.includes(String(product.id))
  );
  ;

  // Fetch orders when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchAllOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  // State for active tab
  const [activeTab, setActiveTab] = useState("account");

  // Handle profile update form submission
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      username,
      addresses: addresses.split(",").map((addr) => addr.trim()),
    };
    dispatch(updateProfile(user!.uid, updatedData));
    setIsEditing(false);
  };

  return (
    <div>
      {user ? (
        <div className="container-fluid">
          {/* Tab navigation */}
          <ul className="nav nav-tabs d-flex justify-content-center gap-2">
            <li className="nav-item">
              <button
                className={`btn btn-primary rounded-pill px-3 m-2 ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account Details
              </button>
            </li>
            <div className="vr my-1"></div>
            <li className="nav-item">
              <button
                className={`btn btn-primary rounded-pill px-3 m-2 ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => setActiveTab("wishlist")}
              >
                My Wishlist
              </button>
            </li>
            <div className="vr my-1"></div>
            <li className="nav-item">
              <button
                className={`btn btn-primary rounded-pill px-3 m-2 ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                My Orders
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          {activeTab === "account" && (
            <div className="pt-4">
              {/* Display user details */}
              {!isEditing ? (
                <div className="container text-center">
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Addresses:</strong> {user.addresses.join(", ")}</p>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setIsEditing(true)} 
                  >
                    Update Profile
                  </button>
                </div>
              ) : (
                // Edit profile form
                <form onSubmit={handleProfileUpdate} className="container col-sm-6 pt-4">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Addresses</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addresses}
                      onChange={(e) => setAddresses(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary rounded-pill">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill ms-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 'My Wishlist' Tab */}
          {activeTab === "wishlist" && favoriteProducts.length === 0 && (
            <div className="alert alert-info text-center">
              <strong>Your wishlist is empty.</strong>
              <p>Browse products and add your favorites!</p>
            </div>
          )}

          {activeTab === "wishlist" && favoriteProducts.length > 0 && (
            <div>
            <h4>My Wishlist</h4>
            <div className="d-flex flex-wrap">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={product.images?.[0]}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">
                      <strong>${product.price}</strong>
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => dispatch(removeFromWishlist(user.uid, String(product.id)))}
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          )}

          {/* 'My Orders' Tab */}
          {activeTab === "orders" && orders.length === 0 && (
            <div className="alert alert-info text-center">
              <strong>You have no orders yet.</strong>
              <p>Browse our store and make your first purchase!</p>
            </div>
          )}

          {activeTab === "orders" && orders.length > 0 && (
            <div>
              <h4>My Orders</h4>
              {loading ? (
                <p className="text-center">Loading orders...</p>
              ) : error ? (
                <p className="text-danger">Error fetching orders: {error}</p>
              ) : (
                <div className="d-flex flex-column">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card mb-3 p-3 border rounded">
                      <h5>Order ID: {order.id}</h5>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Status: {order.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Please log in</div>
      )}
    </div>
  );
}

export default Profile;
