const RocketSMS = require("node-rocketsms-api");

class SMSService {
  _user = process.env.SMS_USER;
  _password = process.env.SMS_PASSWORD;

  async sendActivationCode(phone, code) {
    const sms = new RocketSMS({
      username: this._user,
      password: this._password,
    });
    sms
      .send(phone, code, true)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
}

module.exports = new SMSService();
