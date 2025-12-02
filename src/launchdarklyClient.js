import * as LDClient from "launchdarkly-js-client-sdk";

let ldClient = null;

export function initLaunchDarkly() {
  const clientSideId = process.env.VUE_APP_LD_CLIENT_ID;

  if (!clientSideId) {
    console.info("ℹ️ LaunchDarkly desactivado (sin Client ID configurado)");
    console.info("💡 Para activarlo: configura VUE_APP_LD_CLIENT_ID en .env.development.local");
    return Promise.resolve(null);
  }

  console.log("🟡 Inicializando LaunchDarkly...");

  const user = {
    key: "frontend-user-123",
    name: "Vue CLI User",
    anonymous: false
  };

  console.log("➡️ Inicializando LaunchDarkly...");
  
  try {
    ldClient = LDClient.initialize(clientSideId, user);

    return new Promise((resolve) => {
      let hasResolved = false;

      const safeResolve = (client) => {
        if (!hasResolved) {
          hasResolved = true;
          if (client) {
            console.log("✅ LaunchDarkly conectado correctamente");
            const flags = ldClient.allFlags();
            if (Object.keys(flags).length > 0) {
              console.log("📋 Flags:", flags);
            }
          } else {
            console.info("ℹ️ LaunchDarkly no disponible - usando valores por defecto");
            ldClient = null; // Aseguramos que sea null
          }
          resolve(client);
        }
      };

      ldClient.on("ready", () => {
        // Solo resolvemos con el cliente si realmente está listo
        safeResolve(ldClient);
      });

      ldClient.on("failed", () => {
        console.warn("⚠️ LaunchDarkly: Client ID inválido");
        ldClient = null;
        safeResolve(null);
      });

      // Timeout de seguridad (2 segundos)
      setTimeout(() => {
        ldClient = null;
        safeResolve(null);
      }, 2000);
    });
  } catch (err) {
    console.error("❌ Error inicializando LaunchDarkly:", err);
    console.info("💡 La aplicación funcionará normalmente sin flags");
    return Promise.resolve(null);
  }
}

export function getLDClient() {
  return ldClient;
}