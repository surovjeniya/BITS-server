const tokenService = require("../services/tokenService");

module.exports = function (role) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const accessToken = req.headers.authorization.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({
          message: "Вы не вошли.",
        });
      }
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return res.status(400).json({
          message: "Невалидный токен.",
        });
      }
      if (userData.role !== role) {
        return res.status(400).json({
          message:
            "Вы не обладаете правами.Обратисесь к системному администратору.",
        });
      } else {
        req.user = userData;
        next();
      }
    } catch (e) {
      return res.status(400).json({
        message:
          "Вы не обладаете правами.Обратисесь к системному администратору.",
      });
    }
  };
};
