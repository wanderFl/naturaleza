// ***Este documento está clasificado como PUBLICO por TELEFÓNICA.
// ***This document is classified as PUBLIC by TELEFÓNICA.

pipeline { // creando un Pipeline Declarativo
  agent any // ejecuta en cualquier agente disponible

  // parámetro para definir el número de integrantes del grupo
  parameters {
    string(name: 'GROUP_SIZE', defaultValue: '3', description: 'Número de integrantes del grupo (1,2,3...).')
  }

  stages { // definimos las etapas que componen el pipeline

    stage('Echo Stage') { // Etapa 1: simple eco (sigue el ejemplo de la profe)
      steps {
        echo 'Hello, Jenkins! (Echo Stage)'
        echo "Repo: https://github.com/wanderFl/naturaleza.git"
        echo "Parametro GROUP_SIZE = ${params.GROUP_SIZE}"
      }
    }

    stage('Checkout & Setup') { // Etapa 2: clonar repo y preparar entorno
      steps {
        script {
          // checkout usando credenciales en Jenkins (ajusta credentialsId si usaste otro)
          echo "Realizando checkout (usando credentialsId: 'github-creds')..."
          git branch: 'main',
              url: 'https://github.com/wanderFl/naturaleza.git',
              credentialsId: 'github-creds'

          // leer un archivo opcional team.json si existe para sobreescribir GROUP_SIZE
          if (fileExists('team.json')) {
            echo "team.json encontrado -> intentar leer tamaño del equipo desde el repo"
            def teamText = readFile('team.json').trim()
            try {
              def teamObj = readJSON text: teamText
              if (teamObj.size) {
                echo "team.json: size = ${teamObj.size} -> sobreescribiendo parámetro GROUP_SIZE"
                // nota: no cambiamos params en ejecucion, lo mostramos y lo usamos abajo
                env.TEAM_SIZE = teamObj.size.toString()
              }
            } catch (err) {
              echo "No se pudo parsear team.json, se continuará con params.GROUP_SIZE"
            }
          }
        }
      }
    }

    stage('Build, Test & Deploy (según tamaño)') { // Etapa 3: lógica creativa según GROUP_SIZE
      steps {
        script {
          // prioridad: team.json -> env.TEAM_SIZE -> params.GROUP_SIZE
          def raw = env.TEAM_SIZE ?: params.GROUP_SIZE ?: '1'
          int n = 1
          try { n = Integer.parseInt(raw.toString()) } catch (e) { n = 1 }
          echo "Usando tamaño de equipo = ${n}"

          if (n <= 2) {
            echo "Equipos muy pequeños (<=2): pipeline rápido y despliegue a staging automático"
            sh '''
              echo "Instalando dependencias (rápido)..."
              [ -f package.json ] && npm ci || true
              [ -f package.json ] && npm test || true
              echo "Construyendo artefacto (rápido)..."
              [ -f package.json ] && npm run build || true
              echo "Desplegando automáticamente a STAGING (simulado)..."
            '''
          } else if (n <= 5) {
            echo "Equipos medianos (3-5): pruebas amplias + análisis de calidad y despliegue a staging"
            sh '''
              echo "Instalando dependencias (completo)..."
              [ -f package.json ] && npm ci || true
              [ -f package.json ] && npm run test:full || true
              [ -f package.json ] && npm run lint || true
              echo "Generando reportes: coverage + lint (simulado)..."
            '''
            // despliegue automático a staging
            sh 'echo "Desplegando a STAGING (simulado)..."'
          } else {
            echo "Equipos grandes (>5): generan reportes y REQUIEREN APROBACIÓN MANUAL antes de prod"
            sh '''
              echo "Ejecutando pruebas intensivas y análisis de calidad..."
              [ -f package.json ] && npm ci || true
              [ -f package.json ] && npm run test:full || true
              [ -f package.json ] && npm run lint || true
              echo "Reportes listos. Esperando aprobación para despliegue a PRODUCCIÓN..."
            '''
            // paso de aprobación manual (input) antes de despliegue real
            input message: "Equipo grande (${n}) — ¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
            sh '''
              echo "Aprobado: desplegando a PRODUCCIÓN (simulado)..."
            '''
          }
        }
      }
    }

  } // end stages

  post {
    always {
      echo "Pipeline finalizado. Ejecutar limpieza o notificación si aplica."
    }
    success {
      echo "Build exitoso!"
    }
    failure {
      echo "Build falló. Revisar consola."
    }
  }

} // end pipeline
