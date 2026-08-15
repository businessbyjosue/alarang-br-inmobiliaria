// Pruebas de la generación/validación del código de propiedad.
// Ejecutar con: npm test   (usa el runner integrado de Node, sin dependencias)

import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizarCodigo, esCodigoValido, siguienteCodigo } from "./codigo.ts";

test("normalizarCodigo descarta vacíos, espacios y valores no textuales", () => {
  assert.equal(normalizarCodigo(""), null);
  assert.equal(normalizarCodigo("   "), null);
  assert.equal(normalizarCodigo(null), null);
  assert.equal(normalizarCodigo(undefined), null);
  assert.equal(normalizarCodigo("  42184 "), "42184");
});

test("esCodigoValido rechaza null, undefined y cadena vacía", () => {
  assert.equal(esCodigoValido(null), false);
  assert.equal(esCodigoValido(undefined), false);
  assert.equal(esCodigoValido(""), false);
  assert.equal(esCodigoValido("   "), false);
  assert.equal(esCodigoValido("43841"), true);
});

test("siguienteCodigo continúa el formato real de la base (5 dígitos)", () => {
  assert.equal(siguienteCodigo(["42184", "42111", "43840"]), "43841");
});

test("siguienteCodigo ignora nulos y códigos no numéricos", () => {
  assert.equal(siguienteCodigo([null, "ALR-001", "", "42184"]), "42185");
});

test("siguienteCodigo arranca con 5 dígitos si no hay códigos previos", () => {
  const codigo = siguienteCodigo([]);
  assert.equal(codigo, "10000");
  assert.equal(codigo.length, 5);
});

test("siguienteCodigo con offset evita repetir tras una colisión", () => {
  const existentes = ["43840"];
  assert.equal(siguienteCodigo(existentes, 0), "43841");
  assert.equal(siguienteCodigo(existentes, 1), "43842");
  assert.equal(siguienteCodigo(existentes, 2), "43843");
});

test("el código generado nunca es vacío ni nulo", () => {
  for (const entrada of [[], [null], ["abc"], ["42184"]]) {
    assert.equal(esCodigoValido(siguienteCodigo(entrada)), true);
  }
});
