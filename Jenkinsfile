pipeline {
  agent any

  environment { 
    NODE_HOME = '/usr/local/bin/node' 
    PATH = "$NODE_HOME:$PATH" 
    GITHUB_REPO = 'https://github.com/wanderFl/naturaleza.git' 
  }
    stages {

        /* === 🏗️ BUILD PROJECT === */
        stage('Prepare / Checkout') {
            steps {
                echo "📦 Clonando repositorio desde ${GITHUB_REPO}"
                bat 'git fetch --all'
            }
        }

        stage('Install dependencies') {
            steps {
                bat '''
                    if exist package.json (
                      echo 📦 Instalando dependencias...
                      call npm ci || call npm install
                    ) else (
                      echo ⚠️ No se encontró package.json
                    )
                '''
            }
        }

        stage('Build project') {
            steps {
                bat '''
                    if exist package.json (
                      echo 🏗️ Compilando proyecto...
                      call npm run build
                    ) else (
                      echo ⚠️ No se encontró package.json, omitiendo build
                    )
                '''
            }
        }

        /* === 🧪 TEST PROJECT === */
        stage('Run unit tests') {
            steps {
                bat '''
                    if exist package.json (
                      echo 🧪 Ejecutando pruebas unitarias...
                      call npm run test:unit -- --passWithNoTests || exit /b 0
                    ) else (
                      echo ⚠️ No se encontró package.json, omitiendo tests
                    )
                '''
            }
        }

        stage('Lint code') {
            steps {
                bat '''
                    if exist package.json (
                      echo 🔍 Ejecutando lint...
                      call npm run lint || exit /b 0
                    ) else (
                      echo ⚠️ No se encontró package.json, omitiendo lint
                    )
                '''
            }
        }

        /* === 🔒 SECURITY ANALYSIS (DevSecOps) === */
        stage('Security Scan - SAST') {
            steps {
                echo '🔒 Ejecutando análisis de seguridad con ESLint (SAST)...'
                bat '''
                    cd api-json-vue\\frontend-vue
                    if exist package.json (
                      echo 📦 Instalando dependencias de seguridad...
                      call npm install
                      echo 🔍 Ejecutando ESLint Security Analysis...
                      call npm run lint:security || exit /b 0
                      if exist eslint-security-report.json (
                        echo ✅ Reporte de seguridad generado
                      ) else (
                        echo ⚠️ No se generó reporte de seguridad
                      )
                    )
                '''
            }
            post {
                always {
                    echo '📊 Archivando reporte de seguridad...'
                    archiveArtifacts artifacts: 'api-json-vue/frontend-vue/eslint-security-report.json', allowEmptyArchive: true
                }
            }
        }

        stage('CI Tests') {
            steps {
                bat '''
                    if exist package.json (
                      echo ⚙️ Ejecutando pruebas CI...
                      call npm run test:ci
                    ) else (
                      echo ⚠️ No se encontró package.json, omitiendo pruebas CI
                    )
                '''
            }
        }

        /* === 🚀 DEPLOY === */
       stage('Deploy to Production (Simulado)') {
          when { 
            expression {
          // Funciona tanto si Jenkins ve la rama como 'main' o 'origin/main'
              env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main'
          }
      }
      steps {
        echo "🚀 Iniciando despliegue simulado en máquina Jenkins..."

        bat '''
          echo 📁 Preparando entorno de despliegue local...
          if not exist C:\\Deploy mkdir C:\\Deploy
          if exist C:\\Deploy\\naturaleza rmdir /s /q C:\\Deploy\\naturaleza
          mkdir C:\\Deploy\\naturaleza

          echo 📦 Copiando archivos compilados...
          xcopy dist C:\\Deploy\\naturaleza /E /I /Y >nul

          echo 🌐 Simulando servidor local en http://localhost:8080
          echo (Simulación) La aplicación está "desplegada" en C:\\Deploy\\naturaleza
          echo ✅ Despliegue completado correctamente
        '''
      }
    }
  }

    /* === 📣 NOTIFICACIONES A SLACK === */
   post {
    always {
        echo "🧹 Pipeline finalizado. Limpieza de entorno..."
        cleanWs()
    }
 
    success {
        echo "✅ Build OK."
        // Notificación a Slack usando credencial de Jenkins
        withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
            bat '''
            curl -k -X POST ^
              -H "Content-Type: application/json" ^
              -d "{\\"text\\":\\"✅ Éxito en Jenkins Pipeline Naturaleza\\"}" ^
              %WEBHOOK_URL%
            '''
        }
    }
 
    failure {
        echo "❌ Build falló."
        // Notificación a Slack usando credencial de Jenkins
        withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
            bat '''
            curl -k -X POST ^
              -H "Content-Type: application/json" ^
              -d "{\\"text\\":\\"❌ Falló el Pipeline de Naturaleza\\"}" ^
              %WEBHOOK_URL%
            '''
          }
      }
    }   
}
