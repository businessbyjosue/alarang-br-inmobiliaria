// Validación del código de propiedad, y generación de respaldo.
//
// El código lo asigna normalmente la base de datos: `propiedades.codigo` es
// NOT NULL + UNIQUE y tiene un DEFAULT con secuencia (migración 002), que es
// atómico y no colisiona.
//
// `siguienteCodigo` solo se usa como respaldo en entornos donde esa migración
// todavía no se aplicó. Ver `app/admin/actions.ts`.
//
// Formato observado en los registros existentes: número de 5 dígitos sin
// prefijo (42184, 42111, 43840). Se conserva ese formato.

const LARGO = 5;
const INICIO = 10000; // primer código si la tabla no tuviera ninguno numérico

// Limpia lo que llega del formulario. Devuelve null si no hay valor usable.
export function normalizarCodigo(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim();
  return limpio.length > 0 ? limpio : null;
}

// Un código es válido si es una cadena no vacía (tras recortar espacios).
export function esCodigoValido(valor: unknown): valor is string {
  return normalizarCodigo(valor) !== null;
}

// Siguiente código a partir de los ya existentes: el mayor numérico + 1.
// `offset` desplaza el resultado para reintentar tras una colisión.
export function siguienteCodigo(existentes: (string | null)[], offset = 0): string {
  const numeros = existentes
    .map((c) => normalizarCodigo(c))
    .filter((c): c is string => c !== null && /^\d+$/.test(c))
    .map(Number)
    .filter((n) => Number.isSafeInteger(n));

  const base = numeros.length > 0 ? Math.max(...numeros) : INICIO - 1;
  return String(base + 1 + offset).padStart(LARGO, "0");
}
