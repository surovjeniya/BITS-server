const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

class TokenService {
  _ACCESS = process.env.JWT_ACCESS_SECRET;
  _REFRESH = process.env.JWT_REFRESH_SECRET;

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this._ACCESS, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, this._REFRESH, { expiresIn: "60d" });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(refreshToken, userId) {
    const candidate = await Token.findOne({ user: userId });
    if (!candidate) {
      const token = new Token({
        user: userId,
        refreshToken,
      });
      return await token.save();
    } else {
      candidate.refreshToken = refreshToken;
      return await candidate.save();
    }
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, this._ACCESS);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, this._REFRESH);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}
module.exports = new TokenService();
