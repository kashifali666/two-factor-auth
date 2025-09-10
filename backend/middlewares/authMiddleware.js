import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { users } from "../models/userModel.js";
import { userInvalidTokens } from "../models/invalidTokenModel.js";

async function ensureAuthenticated(req, res, next) {
  const accessToken = req.headers.authorization;

  if (!accessToken)
    return res.status(401).json({ message: "Access token not found" });

  if (await userInvalidTokens.findOne({ accessToken }))
    return res
      .status(401)
      .json({ message: "Access token invalid", code: "AccessTokenInvalid" });

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      config.accessTokenSecret
    );

    req.accessToken = { value: accessToken, exp: decodedAccessToken.exp };

    req.user = { id: decodedAccessToken.userId };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Access token expired", code: "AccessTokenExpired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Access token invalid", code: "AccessTokenInvalid" });
    }
    return res.status(500).json({ message: error.message });
  }
}

function authorize(roles = []) {
  return async (req, res, next) => {
    const user = await users.findOne({ _id: req.user.id });
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

export { ensureAuthenticated, authorize };
