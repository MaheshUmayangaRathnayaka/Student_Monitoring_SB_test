pipeline {
    agent any
    
    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/MaheshUmayangaRathnayaka/Student_Monitoring_SB_test'
                }
            }
        }
        stage('Build Docker Images') {
            parallel {
                stage('Build Server Image') {
                    steps {
                        dir('server') {
                            sh 'docker build -t maheshur/student-performance-server:${BUILD_NUMBER} .'
                        }
                    }
                }
                stage('Build Client Image') {
                    steps {
                        dir('client') {
                            sh 'docker build -t maheshur/student-performance-client:${BUILD_NUMBER} .'
                        }
                    }
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'test-dockerhubpassword', variable: 'DOCKER_PASS')]) {
                   sh "docker login -u maheshur -p ${DOCKER_PASS}"
                }

            }
        }
        stage('Tag as Latest') {
            parallel {
                stage('Tag Server as Latest') {
                    steps {
                        sh "docker tag maheshur/student-performance-server:${BUILD_NUMBER} maheshur/student-performance-server:latest"
                    }
                }
                stage('Tag Client as Latest') {
                    steps {
                        sh "docker tag maheshur/student-performance-client:${BUILD_NUMBER} maheshur/student-performance-client:latest"
                    }
                }
            }
        }
        stage('Push Images') {
            parallel {
                stage('Push Server Images') {
                    steps {
                        sh "docker push maheshur/student-performance-server:${BUILD_NUMBER}"
                        sh "docker push maheshur/student-performance-server:latest"
                    }
                }
                stage('Push Client Images') {
                    steps {
                        sh "docker push maheshur/student-performance-client:${BUILD_NUMBER}"
                        sh "docker push maheshur/student-performance-client:latest"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    # Pull latest images
                    docker pull maheshur/student-performance-server:latest
                    docker pull maheshur/student-performance-client:latest
                    
                    # Stop and remove existing containers
                    docker compose down || true
                    
                    # Start with latest images
                    docker compose up -d
                '''
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}
