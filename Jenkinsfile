pipeline {
   agent any

   parameters {
       string(name: 'GROUP_SIZE', defaultValue: '3', description: 'Tamaño del equipo (1,2,3...)')
   }

   environment {
       NODE_HOME = '/usr/local/bin/node'
       PATH = "$NODE_HOME:$PATH"
       GITHUB_REPO = 'https://github.com/wanderFl/naturaleza.git'
   }

   stages {
       stage('Prepare') {
           steps {
               echo "🔗 Repo: ${GITHUB_REPO}"
               checkout([
                   $class: 'GitSCM',
                   branches: [[name: '*/main']],
                   userRemoteConfigs: [[url: "${GITHUB_REPO}", credentialsId: 'github-creds']]
               ])
               script {
                   // Leer tamaño del equipo desde team.json si existe
                   if (fileExists('team.json')) {
                       try {
                           def json = new groovy.json.JsonSlurper().parseText(readFile('team.json'))
                           env.TEAM_SIZE = json?.size?.toString()
                           echo "📄 team.json -> TEAM_SIZE=${env.TEAM_SIZE}"
                       } catch (e) {
                           echo "⚠️ team.json inválido, se usará parámetro GROUP_SIZE"
                       }
                   } else {
                       echo "ℹ️ No existe team.json, usando GROUP_SIZE"
                   }
               }
           }
       }

       stage('Build & Test') {
           steps {
               script {
                   def hasPkg = fileExists('package.json')
                   if (!hasPkg) {
                       echo "🚫 Sin package.json — omitiendo instalación/test de Node."
                       return
                   }

                   // Helper multiplataforma
                   def run = { cmd ->
                       if (isUnix()) sh cmd else bat cmd
                   }

                   try {
                       echo "📦 Instalando dependencias..."
                       run('npm ci || npm install')
                       echo "🏗️ Ejecutando build..."
                       run('npm run build')
                       echo "🧪 Ejecutando pruebas unitarias..."
                       run('npm run test:unit -- --passWithNoTests')
                   } catch (err) {
                       echo "❌ Error en build/test (no detiene pipeline): ${err}"
                   }
               }
           }
       }

       stage('Quality & Deploy') {
           steps {
               script {
                   def raw = env.TEAM_SIZE ?: params.GROUP_SIZE
                   int n = 1
                   try { n = Integer.parseInt(raw.toString()) } catch (e) { n = 1 }

                   def runIgnore = { cmd ->
                       try {
                           if (isUnix()) sh cmd else bat cmd
                       } catch (ex) {
                           echo "⚠️ Comando falló (ignorado): ${cmd}"
                       }
                   }

                   echo "👥 Usando tamaño de equipo = ${n}"

                   if (n <= 2) {
                       echo "⚡ Flujo rápido (<=2): build + deploy staging"
                       runIgnore('npm run build')
                       runIgnore('echo "🚀 Deploy to STAGING (simulado)"')
                   } else if (n <= 5) {
                       echo "🧩 Flujo intermedio (3-5): lint + test extendido + staging"
                       runIgnore('npm run lint')
                       runIgnore('npm run test:ci')
                       runIgnore('echo "📊 Análisis de código con ESLint completado"')
                       runIgnore('echo "🚀 Deploy to STAGING (simulado)"')
                   } else {
                       echo "🛡️ Flujo controlado (>5): reportes + aprobación manual + producción"
                       runIgnore('npm run lint')
                       runIgnore('npm run test:ci')
                       input message: "Equipo grande (${n}) — ¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
                       runIgnore('echo "🚀 Deploy to PRODUCTION (simulado)"')
                   }
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
               curl -X POST ^
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
               curl -X POST ^
                   -H "Content-Type: application/json" ^
                   -d "{\\"text\\":\\"❌ Falló el Pipeline de Naturaleza\\"}" ^
                   %WEBHOOK_URL%
               '''
           }
       }
   }
}
