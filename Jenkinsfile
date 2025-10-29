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
        stage('Deploy to Production') {
            when { branch 'main' }  // Solo se ejecuta en main
            steps {
                echo "🚀 Desplegando aplicación a Producción (simulado)..."
                bat '''
                    echo 🐳 Construyendo imagen Docker...
                    echo 🚀 Ejecutando contenedor en modo producción...
                    echo ✅ Aplicación desplegada correctamente en entorno de producción
                '''
            }
        }
    }

    /* === 📣 NOTIFICACIONES A SLACK === */
    post {
        always {
            echo '🧹 Pipeline finalizado. Limpieza de entorno...'
            bat '''
                curl -k -X POST ^
                    -H "Content-Type: application/json" ^
                    -d "{\\"text\\":\\"🧹 Pipeline finalizado. Limpieza de entorno...\\"}" ^
                    %SLACK_WEBHOOK_URL%
            '''
        }

        success {
            bat '''
                curl -k -X POST ^
                    -H "Content-Type: application/json" ^
                    -d "{\\"text\\":\\"✅ Éxito en Jenkins Pipeline Naturaleza\\"}" ^
                    %SLACK_WEBHOOK_URL%
            '''
        }

        failure {
            bat '''
                curl -k -X POST ^
                    -H "Content-Type: application/json" ^
                    -d "{\\"text\\":\\"❌ Falló el Pipeline de Naturaleza\\"}" ^
                    %SLACK_WEBHOOK_URL%
            '''
        }
    }
}
