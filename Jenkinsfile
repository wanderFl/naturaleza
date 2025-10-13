// ***Este documento está clasificado como PUBLICO por TELEFÓNICA.
// ***This document is classified as PUBLIC by TELEFÓNICA.

pipeline {
  agent any

  parameters {
    string(name: 'GROUP_SIZE', defaultValue: '3', description: 'Número de integrantes del grupo (1,2,3...)')
  }

  stages {

    stage('Echo Stage') {
      steps {
        echo 'Hello, Jenkins! (Echo Stage)'
        echo "Repo: https://github.com/wanderFl/naturaleza.git"
        echo "Parametro GROUP_SIZE = ${params.GROUP_SIZE}"
      }
    }

    stage('Checkout & Setup') {
      steps {
        script {
          echo "Realizando checkout (credentialsId: 'github-creds')..."
          git branch: 'main',
              url: 'https://github.com/wanderFl/naturaleza.git',
              credentialsId: 'github-creds'

          // leer team.json sin depender de pipeline-utility-steps
          if (fileExists('team.json')) {
            echo "Encontrado team.json — intentando parsear"
            def teamText = readFile('team.json').trim()
            try {
              def json = new groovy.json.JsonSlurper().parseText(teamText)
              if (json?.size) {
                echo "team.json: size = ${json.size} (se usará en lugar de GROUP_SIZE)"
                env.TEAM_SIZE = json.size.toString()
              }
            } catch (err) {
              echo "No se pudo parsear team.json: ${err}"
            }
          } else {
            echo "No existe team.json — usando parámetro GROUP_SIZE"
          }
        }
      }
    }

    stage('Build, Test & Deploy (según tamaño)') {
      steps {
        script {
          def raw = env.TEAM_SIZE ?: params.GROUP_SIZE ?: '1'
          int n = 1
          try { n = Integer.parseInt(raw.toString()) } catch (e) { n = 1 }
          echo "Usando tamaño de equipo = ${n}"

          if (n <= 2) {
            echo "Equipos muy pequeños (<=2): pipeline rápido y despliegue a staging automático"
            if (isUnix()) {
              sh '''
                [ -f package.json ] && npm ci || echo "no package.json"
                [ -f package.json ] && npm test || echo "no tests"
                [ -f package.json ] && npm run build || echo "no build"
                echo "Desplegando a STAGING (simulado)..."
              '''
            } else {
              // Windows (cmd)
              bat '''
                if exist package.json ( npm ci ) else ( echo no_package.json )
                if exist package.json ( npm test ) else ( echo no_tests )
                if exist package.json ( npm run build ) else ( echo no_build )
                echo Desplegando a STAGING (simulado)...
              '''
            }
          } else if (n <= 5) {
            echo "Equipos medianos (3-5): pruebas amplias + análisis de calidad y despliegue a staging"
            if (isUnix()) {
              sh '''
                [ -f package.json ] && npm ci || echo "no package.json"
                [ -f package.json ] && npm run test:full || echo "no test:full script"
                [ -f package.json ] && npm run lint || echo "no lint script"
                echo "Generando reportes (simulado)..."
                echo "Desplegando a STAGING (simulado)..."
              '''
            } else {
              bat '''
                if exist package.json ( npm ci ) else ( echo no_package.json )
                REM ejecutar test:full si existe
                call npm run test:full || echo no_test_full
                call npm run lint || echo no_lint
                echo Generando reportes (simulado)...
                echo Desplegando a STAGING (simulado)...
              '''
            }
          } else {
            echo "Equipos grandes (>5): generan reportes y REQUIEREN APROBACIÓN MANUAL antes de prod"
            if (isUnix()) {
              sh '''
                [ -f package.json ] && npm ci || echo "no package.json"
                [ -f package.json ] && npm run test:full || echo "no test:full script"
                [ -f package.json ] && npm run lint || echo "no lint script"
                echo "Reportes listos. Esperando aprobación..."
              '''
            } else {
              bat '''
                if exist package.json ( npm ci ) else ( echo no_package.json )
                call npm run test:full || echo no_test_full
                call npm run lint || echo no_lint
                echo Reportes listos. Esperando aprobación...
              '''
            }

            // Paso de aprobación manual (funciona igual en Windows/Unix)
            input message: "Equipo grande (${n}) — ¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
            script {
              if (isUnix()) {
                sh 'echo "Aprobado: desplegando a PRODUCCIÓN (simulado)..."'
              } else {
                bat 'echo Aprobado: desplegando a PRODUCCIÓN (simulado)...'
              }
            }
          }
        } // script
      } // steps
    } // stage

  } // stages

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

} // pipeline
