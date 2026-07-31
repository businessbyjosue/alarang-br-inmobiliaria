// Preparado para añadir notificación por WhatsApp más adelante.
//
// Hoy no hace nada: devuelve false y no rompe el flujo. Cuando se contrate un
// proveedor (WhatsApp Cloud API de Meta, o Twilio), basta con implementar el
// fetch aquí y añadir las variables de entorno correspondientes; el punto de
// llamada ya existe en app/vende-tu-propiedad/actions.ts.
//
// Variables previstas (aún NO configuradas):
//   WHATSAPP_TOKEN         token del proveedor
//   WHATSAPP_PHONE_ID      id del número emisor
//   WHATSAPP_TO            número del administrador que recibe el aviso

export async function enviarWhatsApp(_mensaje: string): Promise<boolean> {
  const configurado = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID);
  if (!configurado) return false;

  console.warn("[whatsapp] Proveedor pendiente de implementar.");
  return false;
}
