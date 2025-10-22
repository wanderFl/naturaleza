pipeline {
  agent any

  environment {
    NODE_HOME   = 'C:\\Program Files\\nodejs'
    PATH        = "$NODE_HOME;$PATH"
    GITHUB_REPO = 'https://github.com/wanderFl/naturaleza.git'
  }

  stages {
    stage('Prepare / Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: "${GITHUB_REPO}", credentialsId: 'github-creds']]
        ])
      }
    }

    stage('Install') {
      when { expression { fileExists('package.json') } }
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          run('npm ci || npm install')
        }
      }
    }

    stage('Build') {
      when { expression { fileExists('package.json') } }
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          run('npm run build')
        }
      }
    }

    stage('Unit Tests') {
      when { expression { fileExists('package.json') } }
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          // No romper la build por tests vacíos; marcar UNSTABLE si fallan
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            run('npm run test:unit -- --passWithNoTests')
          }
        }
      }
    }

    stage('Lint') {
      when { expression { fileExists('package.json') } }
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            run('npm run lint')
          }
        }
      }
    }

    stage('CI Tests') {
      when { expression { fileExists('package.json') } }
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          // Estas pruebas son críticas: si fallan, la build falla
          run('npm run test:ci')
        }
      }
    }

    stage('Deploy to STAGING') {
      steps {
        script {
          def run = { cmd -> bat(cmd) }
          // reemplaza por tu comando real de deploy cuando quieras
          run('echo "🚀 Deploy to STAGING (simulado)"')
        }
      }
    }

    stage('Approve & Deploy PRODUCTION') {
      steps {
        // Aprobación explícita antes de producción
        input message: "¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
        script {
          def run = { cmd -> bat(cmd) }
          // reemplaza por tu comando real de deploy a producción
          run('echo "🚀 Deploy to PRODUCTION (simulado)"')
        }
      }
    }
  } // stages
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
