class UserDto {
  getUser(userModel) {
    return {
      id: userModel.id,
      phone: userModel.phone,
      role: userModel.role,
    };
  }
}

module.exports = new UserDto();
