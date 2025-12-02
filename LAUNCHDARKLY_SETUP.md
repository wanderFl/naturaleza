# 🚀 Configuración de LaunchDarkly

## ⚠️ Problema Actual

El Client ID `sdk-9c34b84c-d1eb-403f-b820-40fe35d4b05e` está generando errores 404 y 401, lo que indica que:
- El ambiente no existe en LaunchDarkly
- El Client ID es inválido o fue eliminado
- No tienes permisos para acceder a ese ambiente

## ✅ Solución: Obtener el Client ID Correcto

### Paso 1: Ir a LaunchDarkly Dashboard
1. Ve a [https://app.launchdarkly.com](https://app.launchdarkly.com)
2. Inicia sesión con tu cuenta

### Paso 2: Seleccionar tu Proyecto
1. En la barra lateral izquierda, selecciona tu proyecto
2. Si no tienes proyecto, crea uno nuevo:
   - Click en "Create project"
   - Dale un nombre (ej: "Naturaleza")

### Paso 3: Obtener el Client-side ID
1. Click en el ícono de engranaje ⚙️ (Account Settings)
2. Ve a la sección **"Projects"**
3. Selecciona tu proyecto
4. Ve a la pestaña **"Environments"**
5. Verás una lista de ambientes (Test, Production, etc.)
6. Para cada ambiente verás dos IDs:
   - **SDK key** (server-side) ❌ NO uses este
   - **Client-side ID** ✅ USA ESTE

### Paso 4: Copiar el Client-side ID correcto
El Client-side ID se ve así:
```
6234b5c6d7e8f9a0b1c2d3e4
```
(Es más corto que el que tienes actualmente)

### Paso 5: Actualizar el archivo .env.development.local
1. Abre el archivo `.env.development.local` en la raíz del proyecto
2. Reemplaza el valor actual con tu Client-side ID:
```env
VUE_APP_LD_CLIENT_ID=tu-client-side-id-aqui
```

### Paso 6: Crear el Feature Flag
1. En LaunchDarkly, ve a **"Feature flags"**
2. Click en **"Create flag"**
3. Configura el flag:
   - **Name**: Allow Login
   - **Key**: `allow-login` (IMPORTANTE: debe ser exactamente este nombre)
   - **Flag type**: Boolean
   - **Variations**: 
     - `true` - Login habilitado
     - `false` - Login deshabilitado
4. Click en **"Save flag"**

### Paso 7: Configurar el Flag
1. En el flag `allow-login`, ve a la pestaña **"Targeting"**
2. Activa el flag (toggle en ON)
3. En **"Default rule"**, selecciona la variación que quieres usar por defecto (ej: `true`)
4. Click en **"Review and save"**
5. Click en **"Save changes"**

### Paso 8: Reiniciar la aplicación
```bash
npm run serve
```

## 🧪 Probar que funciona

1. Abre la consola del navegador (F12)
2. Deberías ver:
   ```
   ✅ LaunchDarkly LISTO
   📋 Flags disponibles: {allow-login: true}
   ```

3. Ve a la página de Login
4. En LaunchDarkly, cambia el flag `allow-login` entre ON y OFF
5. Deberías ver el cambio inmediatamente en la página

## 📝 Notas Importantes

- **Client-side ID** es diferente del **SDK Key**
- El Client-side ID es seguro exponerlo en el frontend
- El SDK Key es secreto y solo se usa en el backend
- Si no tienes acceso a LaunchDarkly, la app funcionará normalmente con valores por defecto

## 🆘 Si sigues teniendo problemas

1. **Verifica que el flag `allow-login` existe** en tu proyecto
2. **Verifica que el ambiente está activo** (no archivado)
3. **Verifica que tienes permisos** para acceder al proyecto
4. **Contacta al administrador** de LaunchDarkly de tu equipo

## 🔧 Funcionamiento sin LaunchDarkly

Si no configuras LaunchDarkly o hay errores, la aplicación funcionará normalmente:
- El login estará **siempre habilitado** por defecto
- No habrá control dinámico del login
- Todo lo demás funcionará correctamente
