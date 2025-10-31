# 🔹 Backup y restauración MySQL en Docker: guía genérica

## 1️⃣ Identificar tu contenedor y base de datos

1. Lista los contenedores activos:

```bash
docker ps
```

2. Encuentra el contenedor que corre MySQL y anota su **nombre** (ej: `mysql`) y el **puerto**.
3. Conoce la base de datos que quieres respaldar (ej: `serendipia`) y el usuario que se conecta.

---

## 2️⃣ Crear un backup (dump) de la base de datos

### a) Desde fuera del contenedor

```bash
docker exec mysql mysqldump -u USUARIO -pNOMBRE_PASSWORD NOMBRE_BASE > respaldo.sql
```

O comprimido:

```bash
docker exec mysql mysqldump -u USUARIO -pNOMBRE_PASSWORD NOMBRE_BASE | gzip > respaldo.sql.gz
```

> Explicación: `docker exec` ejecuta el comando dentro del contenedor; `mysqldump` genera el SQL con toda la estructura y datos.

### b) Alternativa: copiar archivo desde dentro del contenedor

```bash
docker exec -it mysql bash
mysqldump -u USUARIO -p NOMBRE_BASE > /tmp/respaldo.sql
exit
docker cp mysql:/tmp/respaldo.sql .
```

---

## 3️⃣ Preparar la base de datos para restaurar

Antes de restaurar un backup:

1. Crea la base si no existe:

```bash
docker exec -it mysql mysql -u root -p -e "CREATE DATABASE NOMBRE_BASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

2. Si el backup tiene **DEFINERs** de un usuario que no existe, crea ese usuario:

```sql
CREATE USER 'USUARIO_DEF'@'%' IDENTIFIED BY 'CONTRASEÑA';
GRANT ALL PRIVILEGES ON *.* TO 'USUARIO_DEF'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

> Esto evita errores como `The user specified as a definer ... does not exist`.

---

## 4️⃣ Restaurar el backup

### a) Si es `.sql`

```bash
docker exec -i mysql mysql -u root -pCONTRASEÑA NOMBRE_BASE < respaldo.sql
```

### b) Si es `.sql.gz`

```bash
gunzip < respaldo.sql.gz | docker exec -i mysql mysql -u root -pCONTRASEÑA NOMBRE_BASE
```

> Explicación: `gunzip` descomprime el respaldo y lo pasa a `mysql`.
> Nota: para evitar problemas con el `-p` interactivo, puedes poner la contraseña directamente sin espacio (`-pCONTRASEÑA`).

### c) Alternativa sin DEFINER

Si quieres ignorar los definers del dump:

```bash
gunzip -c respaldo.sql.gz | sed 's/DEFINER[ ]*=[ ]*`[^`]*`@`[^`]*`//g' | docker exec -i mysql mysql -u root -pCONTRASEÑA NOMBRE_BASE
```

---

## 5️⃣ Verificación rápida

* Listar bases de datos:

```bash
docker exec -it mysql mysql -u root -p -e "SHOW DATABASES;"
```

* Verificar tablas:

```bash
docker exec -it mysql mysql -u root -p NOMBRE_BASE -e "SHOW TABLES;"
```

---

## 6️⃣ Buenas prácticas

* Mantén los backups **comprimidos** (`.gz`) para ahorrar espacio.
* Automatiza backups con **cron** en el VPS.
* Guarda backups **fuera del contenedor**, por si el contenedor se destruye o actualiza.
* Evita exponer la contraseña en la línea de comandos si es posible; usa variables de entorno o archivos `.my.cnf`.

---
