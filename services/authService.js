const User = require("../models/User");
const codeService = require("./codeService");
const tokenService = require("./tokenService");
const TokenService = require("./tokenService");
const userDto = require("../dto/userDto");

class AuthService {
  async registrationStepOne(phone) {
    try {
      const candidate = await User.findOne({ phone });
      if (!candidate) {
        const code = codeService.generateCode();
        const user = new User({
          phone,
          activationCode: code,
        });
        await user.save();
        //const userData = userDto.getUser(user);
        //const tokens = tokenService.generateTokens(userData);
        //await tokenService.saveRefreshToken(tokens.refreshToken, userData.id);
        return {
          //tokens,
          //userData,
          code: user.activationCode,
        };
      } else {
        candidate.activationCode = codeService.generateCode();
        await candidate.save();
        const userData = userDto.getUser(candidate);
        //const tokens = tokenService.generateTokens(userData);
        //await tokenService.saveRefreshToken(tokens.refreshToken, userData.id);
        return {
          //tokens,
          userData,
          code: candidate.activationCode,
        };
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async registrationStepTwo(activationCode) {
    try {
      const user = await User.findOne({ activationCode });
      if (!user) {
        throw new Error("Неправильный код");
      }
      const userData = userDto.getUser(user);
      const tokens = tokenService.generateTokens(userData);
      await tokenService.saveRefreshToken(tokens.refreshToken);
      return {
        tokens,
        userData,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async logout(refreshToken) {
    try {
      const token = await tokenService.removeToken(refreshToken);
      return token;
    } catch (e) {
      throw new Error(e);
    }
  }

  async refresh(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error("Вы не авторизованы");
      }
      const userData = tokenService.validateRefreshToken(refreshToken);

      const tokenFromDb = await tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
        throw new Error("Вы не авторизованы");
      }
      const user = await User.findOne({ id: userData.id });
      const userDTO = userDto.getUser(user);

      const tokens = tokenService.generateTokens(userDTO);
      await tokenService.saveRefreshToken(tokens.refreshToken, userDTO.id);
      return {
        tokens,
        userData: userDTO,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new AuthService();
