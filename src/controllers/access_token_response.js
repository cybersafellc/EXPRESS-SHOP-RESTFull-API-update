import Response from "../app/response.js";

const accessTokenVerify = async (req, res, next) => {
  try {
    res
      .status(200)
      .json(new Response(200, "access_token verifed", null, null, false))
      .end();
  } catch (error) {
    next(error);
  }
};

export default accessTokenVerify;
