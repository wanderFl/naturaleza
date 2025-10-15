pipeline {
  agent any

  parameters {
    string(name: 'GROUP_SIZE', defaultValue: '3', description: 'Tamaño del equipo (1,2,3...)')
  }

  stages {

    stage('Prepare') {
      steps {
        echo "Repo: https://github.com/wanderFl/naturaleza.git"
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/wanderFl/naturaleza.git', credentialsId: 'github-creds']]
        ])
        script {
          // parse team.json si existe
          if (fileExists('team.json')) {
            try {
              def json = new groovy.json.JsonSlurper().parseText(readFile('team.json'))
              env.TEAM_SIZE = json?.size?.toString()
              echo "team.json -> TEAM_SIZE=${env.TEAM_SIZE}"
            } catch (e) {
              echo "team.json inválido, se usará GROUP_SIZE"
            }
          } else {
            echo "No existe team.json"
          }
        }
      }
    }

    stage('Build & Test') {
      steps {
        script {
          def hasPkg = fileExists('package.json')
          if (!hasPkg) {
            echo "Sin package.json — omitiendo instalación/test de Node."
            return
          }

          // helper multiplataforma
          def run = { cmd ->
            if (isUnix()) {
              sh cmd
            } else {
              bat cmd
            }
          }

          // instalación + pruebas básicas
          try {
            run('npm ci')
            run('npm test')
          } catch (err) {
            echo "Error en build/test (se muestra pero no detiene aquí): ${err}"
            // opcional: throw err  -> si quieres que falle en este punto
          }
        }
      }
    }

    stage('Quality & Deploy') {
      steps {
        script {
          def raw = env.TEAM_SIZE ?: params.GROUP_SIZE
          int n = 1
          try { n = Integer.parseInt(raw.toString()) } catch(e) { n = 1 }

          def runIgnore = { cmd ->
            try {
              if (isUnix()) sh cmd else bat cmd
            } catch (ex) {
              echo "Comando falló (ignored): ${cmd}"
            }
          }

          echo "Usando tamaño de equipo = ${n}"

          if (n <= 2) {
            echo "Flujo rápido (<=2): build + deploy staging"
            runIgnore('npm run build')
            runIgnore('echo Deploy to STAGING (simulado)')
          } else if (n <= 5) {
            echo "Flujo intermedio (3-5): tests extendidos + calidad + staging"
            runIgnore('npm run test:full')
            runIgnore('npm run lint')
            runIgnore('echo Generando reportes (simulado)')
            runIgnore('echo Deploy to STAGING (simulado)')
          } else {
            echo "Flujo controlado (>5): reportes + aprobación manual"
            runIgnore('npm run test:full')
            runIgnore('npm run lint')
            input message: "Equipo grande (${n}) — ¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
            runIgnore('echo Deploy to PRODUCTION (simulado)')
          }
        }
      }
    }

  } // stages

  post {
    always { echo "Pipeline finalizado." }
    success { echo "Build OK." }
    failure { echo "Build falló." }
  }
}
