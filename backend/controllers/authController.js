import { users } from "../models/userModel.js";
import { userInvalidTokens } from "../models/invalidTokenModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import crypto from "crypto";
import cache from "../utils/cache.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(422).json({ message: "Please fill all fields" });

    if (await users.findOne({ email }))
      return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.insert({
      name,
      email,
      password: hashedPassword,
      role: role ?? "member",
      "2faEnable": false,
      "2faSecret": null,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", id: newUser._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(422).json({ message: "Please fill all fields" });

    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    if (user["2faEnable"]) {
      const tempToken = crypto.randomUUID();
      cache.set(
        config.cacheTemporaryTokenPrefix + tempToken,
        user._id,
        config.cacheTemporaryTokenExpiresInSeconds
      );
      return res.status(200).json({
        tempToken,
        expiresInSeconds: config.cacheTemporaryTokenExpiresInSeconds,
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      config.accessTokenSecret,
      { subject: "accessApi", expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email, accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login2FA = async (req, res) => {
  try {
    const { tempToken, totp } = req.body;
    if (!tempToken || !totp)
      return res.status(422).json({ message: "Please fill all fields" });

    const userId = cache.get(config.cacheTemporaryTokenPrefix + tempToken);
    if (!userId)
      return res
        .status(401)
        .json({ message: "Temporary token incorrect or expired" });

    const user = await users.findOne({ _id: userId });
    if (!authenticator.check(totp, user["2faSecret"]))
      return res
        .status(401)
        .json({ message: "The provided TOTP is incorrect or expired!" });

    const accessToken = jwt.sign(
      { userId: user._id },
      config.accessTokenSecret,
      { subject: "accessApi", expiresIn: config.accessTokenExpiresIn }
    );
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email, accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const generate2FA = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user.email, "kashif.Dev", secret);
    await users.update({ _id: req.user.id }, { $set: { "2faSecret": secret } });
    await users.compactDatafile();

    const qrCode = await qrcode.toBuffer(uri, { type: "image/png", margin: 1 });
    res.setHeader("Content-Disposition", "attachment; filename=qrcode.png");
    return res.status(200).type("image/png").send(qrCode);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const validate2FA = async (req, res) => {
  try {
    const { totp } = req.body;
    if (!totp) return res.status(422).json({ message: "TOTP is required" });

    const user = await users.findOne({ _id: req.user.id });
    if (!authenticator.check(totp, user["2faSecret"]))
      return res.status(400).json({ message: "TOTP incorrect or expired" });

    await users.update({ _id: req.user.id }, { $set: { "2faEnable": true } });
    await users.compactDatafile();
    return res.status(200).json({ message: "TOTP validated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await userInvalidTokens.insert({
      accessToken: req.accessToken.value,
      userId: req.user.id,
      expirationTime: req.accessToken.exp,
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
