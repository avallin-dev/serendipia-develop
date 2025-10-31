pipeline {
    agent none  // No usar un agente global

    environment {
        DOCKER_IMAGE_NAME = 'nexo-serendipia'
        DOCKER_CONTAINER_NAME = 'nexo-serendipia'
        APP_PORT = '8083'
    }

    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    stages {
        stage('Construir imagen Docker') {
            agent any
            environment {
                ENV_FILE = credentials('serendipia-environment-variables')
            }
            steps {
                echo 'Construyendo la imagen de Docker'
                sh 'cp $ENV_FILE .env'
                sh "docker build --no-cache -t ${DOCKER_IMAGE_NAME}:latest ."
            }
        }

        stage('Eliminar contenedor anterior (si existe)') {
            agent any
            steps {
                echo 'Eliminando contenedor anterior si está corriendo'
                sh """
                docker ps -q --filter "name=${DOCKER_CONTAINER_NAME}" | grep -q . && docker stop ${DOCKER_CONTAINER_NAME} || true
                docker ps -aq --filter "name=${DOCKER_CONTAINER_NAME}" | grep -q . && docker rm ${DOCKER_CONTAINER_NAME} || true
                """
            }
        }

        stage('Ejecutar nuevo contenedor') {
            agent any
            steps {
                echo 'Ejecutando el nuevo contenedor'
                sh """
                docker run -d -p${APP_PORT}:3000 --name ${DOCKER_CONTAINER_NAME} --network jenkins ${DOCKER_IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado exitosamente y la aplicación fue desplegada automáticamente.'
        }
        failure {
            echo 'Pipeline falló en alguna etapa.'
            script {
                currentBuild.result = 'FAILURE'
            }
        }
    }
}