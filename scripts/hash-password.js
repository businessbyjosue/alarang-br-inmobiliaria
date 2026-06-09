// Uso: node scripts/hash-password.js TU_CONTRASEÑA
// Copia el hash resultante en .env.local como ADMIN_PASSWORD_HASH

const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Uso: node scripts/hash-password.js TU_CONTRASEÑA");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nHash generado:");
  console.log(hash);
  console.log("\nAgrega esto a .env.local:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
