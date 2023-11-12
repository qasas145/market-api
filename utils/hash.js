const bcrypt = require('bcryptjs');

const hashPassword = async (password) => bcrypt.hash(password, 12);

const comparePasswords = async (password, hashedPassword) =>{
  let status = await bcrypt.compare(password, hashedPassword);
  return status;
}

module.exports = { hashPassword, comparePasswords };
