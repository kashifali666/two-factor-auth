import "dotenv/config";

export default {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: "30m",

  cacheTemporaryTokenPrefix: "tempToken:",
  cacheTemporaryTokenExpiresInSeconds: 180,
};
