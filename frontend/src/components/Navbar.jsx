import { Link } from "react-router-dom";

import { Icon } from "@iconify/react";

// Description: Navbar so user can change routes within the project. Uses bootstrap which accounts for mobile and desktop views.
// @queueLength: Coming from queueResult in App component to show both RUNNING and WAITING as length of queue
const Navbar = ({ queueLength }) => {
  return (
    <nav className="navbar navbar-expand-lg text-white d-flex bg-primary align-items-center px-0 px-sm-5 justify-content-evenly">
      <div className="container-fluid justify-content-between">
        <Link
          to="/"
          className="d-flex align-items-center fs-1 fw-bold text-light text-decoration-none"
        >
          <Icon
            icon="material-symbols:speed"
            color="white"
            width={70}
            height={70}
          />
          <div>AlgoGauge</div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end mt-3 mt-sm-0"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ">
            <li className="nav-item shadow-lg d-flex">
              <Link
                to="/experiment"
                className="btn btn-secondary fs-4 w-100 fw-bold d-flex justify-content-center"
              >
                Experiment{" "}
                <Icon
                  icon="icon-park-solid:experiment"
                  width="32"
                  height="32"
                  className="align-self-center"
                />
              </Link>
            </li>
            <li className="nav-item shadow-lg mx-lg-4 my-3 my-lg-0 d-flex">
              <Link
                to="/history"
                className="btn btn-secondary fs-4 w-100 fw-bold d-flex justify-content-center"
              >
                History{" "}
                <Icon
                  icon="material-symbols:history"
                  width="32"
                  height="32"
                  className="align-self-center"
                />
              </Link>
            </li>
            <li className="nav-item shadow-lg d-flex">
              <Link
                to="/queue"
                className="btn btn-secondary fs-4 w-100 fw-bold d-flex justify-content-center"
              >
                Queue
                {queueLength >= 0 ? (
                  <span
                    className={`${
                      queueLength > 0 ? "text-danger" : "text-success"
                    }`}
                  >
                    {`(${queueLength})`}
                  </span>
                ) : null}
                <Icon
                  icon="fluent:people-queue-20-filled"
                  width={32}
                  height={32}
                  className="align-self-center"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
