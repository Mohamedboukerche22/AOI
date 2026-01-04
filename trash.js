import bcrypt from 'bcryptjs';

async function hashAOI() {
  const password = 'AOI';
  const salt = await bcrypt.genSalt(10); // 10 rounds like your example
  const hashed = await bcrypt.hash(password, salt);
  console.log(hashed);
  return hashed;
}

hashAOI();