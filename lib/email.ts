// Envío de correo con Resend por HTTP — sin dependencias nuevas.
//
// Variables de entorno necesarias (ver .env.local.example):
//   RESEND_API_KEY   clave de https://resend.com (plan gratis: 3.000 correos/mes)
//   EMAIL_TO         correo del administrador que recibe las solicitudes
//   EMAIL_FROM       remitente verificado en Resend
//                    (mientras no verifiques dominio: onboarding@resend.dev)
//
// Si falta configuración, la función NO lanza error: registra un aviso y
// devuelve false, para que una solicitud ya guardada en la base no se pierda.

export async function enviarEmail({
  asunto,
  html,
  responderA,
}: {
  asunto: string;
  html: string;
  responderA?: string | null;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM ?? "Alarang B.R. <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("[email] Falta RESEND_API_KEY o EMAIL_TO — no se envió la notificación.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: asunto,
        html,
        ...(responderA ? { reply_to: responderA } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[email] Resend respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Error de red al enviar", err);
    return false;
  }
}
