#!/bin/bash

LOG_FILE="./infra_health.log"
echo "=== Ejecucion de Monitoreo: $(date) ===" >> $LOG_FILE

CONTENEDORES=("trapoapp-nginx-1" "trapoapp-app1-1" "trapoapp-app2-1" "trapoapp-prometheus-1" "trapoapp-grafana-1")

for container in "${CONTENEDORES[@]}"
do
    STATUS=$(docker inspect -f '{{.State.Running}}' $container 2>/dev/null)
    
    if [ "$STATUS" = "true" ]; then
        echo "[OK] El servicio $container esta operando normalmente." >> $LOG_FILE
    else
        echo "[ALERTA] El servicio $container esta CAIDO. Iniciando autorecuperacion tecnica..." >> $LOG_FILE
        docker start $container >> $LOG_FILE 2>&1
    fi
done
echo "-" >> $LOG_FILE