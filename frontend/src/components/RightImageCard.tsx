import summer_dress from "../assets/summer-dress.jpg";

export default function RightImageCard() {
  return (
    <div className="container-fluid">
      <div className="row g-1 text-center mb-2 categories-card">
        <div className="col-sm-6 col-md-5">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `url(${summer_dress})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              className="btn btn-outline-light btn-lg shadow"
              type="button"
            >
              Example button <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="col-sm-6 col-md-7">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `url(${summer_dress})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              className="btn btn-outline-light btn-lg shadow"
              type="button"
            >
              Example button <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
