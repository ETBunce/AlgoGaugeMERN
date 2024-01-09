import { Helmet } from "react-helmet-async";
const basename = process.env.PUBLIC_URL;

// Description: Route triggered whenever user enters in a route that does not exist and informs user.
const Error = () => {
  return (
    <>
      <Helmet>
        <title>Error - AlgoGauge - WSU</title>
      </Helmet>
      <div className="bg-danger text-light text-center">
        Uh oh, how did you get here? You aren't supposed to be here!{" "}
      </div>

      <img
        src={basename + "/pics/brad/bradConfused.png"}
        className="img-fluid"
        alt="brad confused"
      />
    </>
  );
};

export default Error;
