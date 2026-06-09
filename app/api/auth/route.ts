import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password, action } = await req.json();

  if (action === "logout") {
    await deleteSession();
    return NextResponse.json({ ok: true });
  }

  if (!password) {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH!;
  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
