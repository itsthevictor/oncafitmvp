const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    weight: user.weight,
    unit: user.unit,
  };
};

module.exports = createTokenUser;
