# 📊 Manual del Administrador: Pastel Premium POS

Bienvenido al panel de gestión de Pastel Premium. Este manual le guiará a través de las herramientas administrativas para optimizar su negocio.

## 1. Gestión de Inventario
El sistema cuenta con un sistema **multi-almacén** y **escandallos automáticos**.

- **Productos y Almacén**: Puede definir en qué almacén se encuentra cada producto (Barra, Cocina, Terraza).
- **Recetas (Escandallos)**: Vincule ingredientes a un plato. Al marcar un plato como "Listo" en cocina, el sistema descontará automáticamente los ingredientes de sus respectivos almacenes.
- **Alertas de Stock**: El sistema le avisará visualmente cuando un producto baje del mínimo configurado.

## 2. Diseñador del Plano de Planta
Usted tiene el control total sobre la disposición de su sala.

- **Zonas**: Cree zonas ilimitadas (Salón, Terraza, Planta Alta).
- **Mesas**: Arrastre y suelte mesas en el diseñador. Puede cambiar su forma (rectángular o circular) y tamaño.
- **Sincronización**: Los cambios realizados en el diseñador se reflejan instantáneamente en los terminales de los camareros.

## 3. Gestión de Usuarios y Seguridad
Pastel Premium utiliza un sistema de **Autenticación Híbrida**.

- **Administradores**: Acceden con Email y Contraseña desde cualquier PC/Tablet.
- **Staff (Camareros/Cocina)**: Utilizan un **PIN de 4 dígitos** para un acceso rápido y táctil.
- **Control de Presencia**: El sistema obliga a fichar entrada antes de operar el POS. Los turnos que excedan las 12 horas se cerrarán automáticamente por seguridad.
- **Roles**:
  - `ADMIN`: Acceso total.
  - `WAITER`: Acceso al Comandero y Plano de Sala.
  - `KITCHEN`: Acceso exclusivo al Monitor de Pedidos.

## 4. Supervisión de Ventas
Desde el panel principal puede ver el estado de todas las mesas en tiempo real:
- ⚪ **Gris**: Libre.
- 🔴 **Rojo**: Ocupada (con ticket abierto).
- 🟡 **Amarillo**: Sucia/Pendiente de limpieza.

## 5. Configuración del Negocio (Ajustes)
En la sección "Mi Negocio", puede personalizar la identidad legal y visual de su establecimiento:
- **Logo SVG**: Suba su logotipo vectorial para una impresión térmica nítida en los tickets.
- **Datos Fiscales**: Nombre, Razón Social, CIF y Dirección (aparecerán en la cabecera de la factura).
- **Marketing Digital**: Introduzca la URL de sus redes sociales o Linktree. El sistema generará automáticamente un **Código QR** al final de cada ticket para que sus clientes le sigan con un solo escaneo.

---

> [!TIP]
> **Seguridad Proactiva**: Cambie el PIN de sus empleados regularmente para mantener la integridad del sistema. El sistema cerrará sesión automáticamente tras 12 horas de inactividad.

> [!IMPORTANT]
> **Cumplimiento Fiscal**: Recuerde que cada ticket generado cumple con los requisitos iniciales de VeriFactu (firma y encadenamiento de hashes).
