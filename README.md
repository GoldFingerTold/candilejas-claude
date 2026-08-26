# Sitio web — Eventos Candilejas (demo / pitch)

Sitio de una sola página (Inicio, Quiénes Somos, Servicios, Eventos Sociales, Eventos
Empresariales, Contacto) con panel de administración privado, armado como propuesta para
mostrarle a Eventos Candilejas — su sitio actual (`eventoscandilejas.com.ar`) es PHP viejo,
sin ningún panel de edición y con el formulario de contacto roto.

Contenido real tomado de su sitio actual (textos de servicios, tipos de evento, contacto,
logo). **La galería de fotos arranca vacía a propósito** — no se copiaron las fotos del
sitio original por no tener claro si son de stock pago o de clientes reales; se suben
desde el panel cuando haya fotos propias para mostrar.

## Arquitectura

Igual que los demás sitios de este mismo esquema (Celine, Le Coin, Leprett): Node.js +
Express + MongoDB Atlas (desde el día uno, sin pasar por SQLite) + panel `/admin` sin
build de frontend.

**Función destacada pedida especialmente para este sitio**: "Próximo evento" — un bloque
togglable (activado/desactivado + etiqueta + texto + foto o video) que aparece en la
portada solo cuando está activado, para anunciar ferias, fechas límite de reserva, etc.
Arranca **desactivado** por defecto.

## Instalación y desarrollo local

Mismos pasos que los otros proyectos - ver el README de `sitio-celine-stajcer` para el
detalle completo de cómo armar el cluster gratis en MongoDB Atlas. Repaso rápido:

```
npm install
copy .env.example .env
```

Completá `MONGODB_URI` (un cluster/proyecto propio para Candilejas cuando esto pase a ser
un cliente real — durante el desarrollo de esta demo se usó una base de prueba separada
dentro del cluster ya existente, para no tener que crear infraestructura antes de saber
si el pitch prospera), `ADMIN_PASSWORD` y `SESSION_SECRET`.

```
npm start
```

## Estado actual

- ✅ Frontend + backend + panel de administración completos y probados localmente
  (login, textos, próximo evento, galería, redes sociales, mensajes, cambio de
  contraseña).
- ⏳ **Todavía no está desplegado** — no tiene repo de GitHub ni sitio en Hostinger
  conectado. Se decide si vale la pena desplegarlo según cómo evolucione la conversación
  con el cliente.
- ⏳ Sin fotos reales en la galería ni en la portada (queda un degradé de marca de fondo
  hasta que se cargue una foto real).
