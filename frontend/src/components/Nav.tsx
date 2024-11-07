import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cart from "../pages/Cart";

export default function Nav() {
  // Button styles
  const buttonStyles = {
    default: {
      color: "gray",
      cursor: "pointer",
      height: "2.2rem",
    },
    active: {
      backgroundColor: "black",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      height: "2.2rem",
    },
  };

  // Show products based on category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryList: string[] = [
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

  const navigate = useNavigate();
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    navigate(`/products/${category.toLowerCase()}`);
  };

  return (
    <div className="">
  
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <div className="d-flex gap-3">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasDarkNavbar"
              aria-controls="offcanvasDarkNavbar"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list text-light"></i>
            </button>
            <Link className="navbar-brand" to="/">
              <b className="fw-bold">Dash</b>
            </Link>
          </div>
          <div className="btn-group gap-2">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2 rounded-5"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
            <Link className="navbar-item" to="/">
              <button
                className="btn text-light bg-dark rounded-4 p-2"
                type="button"
              >
                <i className="bi bi-geo-alt"></i>
              </button>
            </Link>
            <Link className="navbar-item" to="/profile">
              <button
                className="btn text-light bg-dark rounded-4 p-2"
                type="button"
              >
                <i className="bi bi-person"></i>
              </button>
            </Link>
            <button
                className="btn text-light bg-dark rounded-4 p-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkCart"
                aria-controls="offcanvasDarkCart"
                aria-label="Toggle navigation"
              >
                <i className="bi bi-cart"></i>
              </button>
            
          </div>
          <div
            className="offcanvas offcanvas-start text-bg-dark"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Dash
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/some-link">
                    Link
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/profile"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    My Account
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/logout">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex mt-3" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
          <div
            className="offcanvas offcanvas-end bg-white text-dark"
            tabIndex={1}
            id="offcanvasDarkCart"
            aria-labelledby="offcanvasDarkCartLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkCartLabel">
                Cart
              </h5>
              <button
                type="button"
                className="btn-close btn-close-dark"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
             <Cart />
            </div>
          </div>
        </div>
      </nav>

      {/* Categories */}
      <div className="container d-flex gap-2 m-2 pb-3 button-group">
        {categoryList.map((category) => (
          <button
            onClick={(e) => {
              e.preventDefault();
              selectCategory(category);
            }}
            className="btn btn-sm rounded-pill text-nowrap"
            type="button"
            style={
              activeCategory === category
                ? buttonStyles.active
                : buttonStyles.default
            }
            id={category}
            aria-pressed={activeCategory === category}
            key={category}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
