// Uso: node scripts/verify-password.js TU_CONTRASEÑA
// Compara tu contraseña contra el hash en .env.local
const bcrypt = require("bcryptjs");
const fs = require("fs");

const password = process.argv[2];
if (!password) {
  console.error("Uso: node scripts/verify-password.js TU_CONTRASEÑA");
  process.exit(1);
}

const env = fs.readFileSync(".env.local", "utf8");
const m = env.match(/ADMIN_PASSWORD_HASH=(.*)/);
if (!m) {
  console.error("No se encontró ADMIN_PASSWORD_HASH en .env.local");
  process.exit(1);
}
const hash = m[1].trim();

console.log(bcrypt.compareSync(password, hash)
  ? "✓ CONTRASEÑA CORRECTA — coincide con el hash local"
  : "✗ CONTRASEÑA INCORRECTA — no coincide con el hash local");
