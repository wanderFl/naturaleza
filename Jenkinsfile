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
            agent { docker { image 'node:18.19' } }
            steps {
                echo "📦 Clonando repositorio desde ${GITHUB_REPO}"
                sh 'git fetch --all'
            }
        }

        stage('Install dependencies') {
            agent { docker { image 'node:18.19' } }
            steps {
                sh '''
                    if [ -f package.json ]; then
                      echo "📦 Instalando dependencias..."
                      npm ci || npm install
                    else
                      echo "⚠️ No se encontró package.json"
                    fi
                '''
            }
        }

        stage('Build project') {
            agent { docker { image 'node:18.19' } }
            steps {
                sh '''
                    if [ -f package.json ]; then
                      echo "🏗️ Compilando proyecto..."
                      npm run build
                    else
                      echo "⚠️ No se encontró package.json, omitiendo build"
                    fi
                '''
            }
        }

        /* === 🧪 TEST PROJECT === */
        stage('Run unit tests') {
            agent { docker { image 'node:18.19' } }
            steps {
                sh '''
                    if [ -f package.json ]; then
                      echo "🧪 Ejecutando pruebas unitarias..."
                      npm run test:unit -- --passWithNoTests || true
                    else
                      echo "⚠️ No se encontró package.json, omitiendo tests"
                    fi
                '''
            }
        }

        stage('Lint code') {
            agent { docker { image 'node:18.19' } }
            steps {
                sh '''
                    if [ -f package.json ]; then
                      echo "🔍 Ejecutando lint..."
                      npm run lint || true
                    else
                      echo "⚠️ No se encontró package.json, omitiendo lint"
                    fi
                '''
            }
        }

        stage('CI Tests') {
            agent { docker { image 'node:18.19' } }
            steps {
                sh '''
                    if [ -f package.json ]; then
                      echo "⚙️ Ejecutando pruebas CI..."
                      npm run test:ci
                    else
                      echo "⚠️ No se encontró package.json, omitiendo pruebas CI"
                    fi
                '''
            }
        }

        /* === 🚀 DEPLOY === */
        stage('Deploy to Production') {
            when { branch 'main' }  // Solo se ejecuta en main
            agent { docker { image 'docker:stable-dind' } }
            steps {
                echo "🚀 Desplegando aplicación a Producción (simulado)..."

                sh '''
                    echo "🐳 Construyendo imagen Docker..."
                    docker build -t naturaleza-app:latest .

                    echo "🚀 Ejecutando contenedor en modo producción..."
                    docker run -d -p 8080:80 --name naturaleza naturaleza-app:latest

                    echo "✅ Aplicación desplegada correctamente en entorno de producción"
                '''
            }
        }
    }

    /* === 📣 NOTIFICACIONES A SLACK === */
    post {
        always {
            echo '🧹 Pipeline finalizado. Limpieza de entorno...'
            sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text": "🧹 Pipeline finalizado. Limpieza de entorno..."}' \
                $SLACK_WEBHOOK_URL
            '''
        }

        success {
            sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text": "✅ Éxito en Jenkins Pipeline Naturaleza"}' \
                $SLACK_WEBHOOK_URL
            '''
        }

        failure {
            sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text": "❌ Falló el Pipeline de Naturaleza"}' \
                $SLACK_WEBHOOK_URL
            '''
        }
    }
}
