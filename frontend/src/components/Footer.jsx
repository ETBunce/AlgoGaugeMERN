// Description: WSU styled footer indicating this is the capstone project made for Brad
const basename = process.env.PUBLIC_URL;
const Footer = () => {
  return (
    <footer className="d-flex flex-column flex-lg-row bg-primary justify-content-between align-items-center p-3">
      <div>
        <img
          className="weber-logo-icon"
          src={basename + "/pics/WSU_Banners/WSU_Engineering_Dark.png"}
          alt="Weber"
        />
      </div>
      <div className="text-white capstone my-3 my-lg-0">
        <div className="text-light">
          {" "}
          CS 4760 Capstone Project
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="text-white">Dr. Peterson's Tenure Project</div>
        <div>
          <img
            className="brad-icon"
            src={basename + "/pics/brad/bradThink.png"}
            alt="brad is thinking"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
