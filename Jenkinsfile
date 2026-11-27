pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'achillesonga/my-web-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        CONTAINER_NAME = 'my-web-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://docker.io', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                sh """
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}:latest
                """
            }
        }
    }
}
