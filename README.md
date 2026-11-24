Self-Healing Containerized Infrastructure & Observability Stack

Arquitectura de microservicios en contenedores diseñada para demostrar balanceo de carga, alta disponibilidad, monitoreo en tiempo real y autorrecuperación automatizada en entornos Linux.

Arquitectura del Sistema

El ecosistema está orquestado mediante Docker Compose sobre una red aislada bridge e integra los siguientes componentes:

* Reverse Proxy & Load Balancer (`Nginx`): Distribuye el tráfico HTTP entrante (puerto `80`) mediante Round-Robin entre múltiples réplicas de la aplicación backend[cite: 4, 6].
* Backend API (`Node.js` + `Express`): Dos instancias independientes (`app1`, `app2`) corriendo sobre imágenes ligeras `node:18-alpine`[cite: 1, 2, 6]. Incluye endpoints para pruebas de estrés de CPU (`/compute`), verificación de base de datos (`/db-check`) y exposición de métricas (`/metrics`).
* Base de Datos (`PostgreSQL 15`): Almacenamiento persistente gestionado mediante volúmenes de Docker[cite: 6].
* Stack de Observabilidad (`Prometheus` + `Grafana` + `cAdvisor`):
  * Prometheus: Recolecta métricas cada 5 segundos tanto de las instancias Node.js (`prom-client`) como de los recursos del host/contenedores[cite: 2, 3, 5].
  * cAdvisor: Expone métricas de consumo de CPU, memoria, red y disco a nivel de contenedor[cite: 6].
  * Grafana: Panel de visualización conectado a Prometheus para monitorear la salud del sistema en tiempo real[cite: 6].
* Autorrecuperación (`Bash Scripting`): Script automatizado (`monitor_infra.sh`) que audita el estado de los contenedores críticos y reinicia automáticamente cualquier servicio caído, registrando auditorías en `infra_health.log`[cite: 7].

Stack Tecnológico

* **Contenedores y Orquestación:** Docker, Docker Compose[cite: 1, 6]
* **Backend & Runtime:** Node.js 18, Express.js[cite: 1, 2]
* **Proxy Inverso:** Nginx[cite: 4, 6]
* **Base de Datos:** PostgreSQL 15[cite: 6]
* **Monitoreo y Métricas:** Prometheus, Grafana, cAdvisor, `prom-client`[cite: 2, 5, 6]
* **Automatización / OS:** Linux Bash Scripting[cite: 7]

 Estructura del Proyecto

```text
├── app/
│   ├── Dockerfile          # Imagen ligera basada en Alpine Linux[cite: 1]
│   ├── package.json        # Dependencias (express, pg, prom-client)[cite: 2]
│   └── server.js           # API REST con endpoints de carga y métricas
├── nginx/
│   └── nginx.conf          # Configuración de upstream y proxy inverso[cite: 4]
├── prometheus/
│   └── prometheus.yml      # Configuración de scraping cada 5s[cite: 5]
├── docker-compose.yml      # Orquestación completa de los 7 servicios[cite: 6]
└── monitor_infra.sh        # Script Bash de health-check y self-healing[cite: 7]
