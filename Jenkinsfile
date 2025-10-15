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
          // leer team.json si existe
          if (fileExists('team.json')) {
            try {
              def json = new groovy.json.JsonSlurper().parseText(readFile('team.json'))
              env.TEAM_SIZE = json?.size?.toString()
              echo "team.json -> TEAM_SIZE=${env.TEAM_SIZE}"
            } catch (e) {
              echo "team.json inválido; se usa GROUP_SIZE"
            }
          }
          echo "PARAM GROUP_SIZE=${params.GROUP_SIZE}"
        }
      }
    }

    stage('Build & Test') {
      steps {
        script {
          // helper multiplataforma
          def run = { cmd -> if (isUnix()) sh(cmd) else bat(cmd) }

          // instala deps y corre pruebas básicas si existe package.json (ejemplo genérico)
          if (fileExists('package.json')) {
            run('[ -f package.json ] && npm ci || echo "no package.json"')
            run('[ -f package.json ] && npm test || echo "sin tests configurados"')
          } else {
            echo "Sin package.json — omitiendo instalación/tests."
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
          echo "Usando tamaño = ${n}"

          def run = { cmd -> if (isUnix()) sh(cmd) else bat(cmd) }

          if (n <= 2) {
            echo "Flujo rápido (<=2) → build + deploy staging"
            run('echo "build rápido"; [ -f package.json ] && npm run build || echo "no build"')
            run('echo "deploy a STAGING (simulado)"')
          } else if (n <= 5) {
            echo "Flujo intermedio (3-5) → tests extendidos + calidad + staging"
            run('echo "tests extendidos y lint (simulado)"; [ -f package.json ] && npm run test:full || echo "sin test:full"')
            run('echo "generando reportes (simulado)"; echo "deploy a STAGING (simulado)"')
          } else {
            echo "Flujo controlado (>5) → reportes + aprobación manual"
            run('echo "tests intensivos y reportes (simulado)"')
            input message: "Equipo grande (${n}) — ¿Aprobar despliegue a PRODUCCIÓN?", ok: 'Aprobar'
            run('echo "Desplegando a PRODUCCIÓN (simulado)"')
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
