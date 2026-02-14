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
                withCredentials([string(credentialsId: 'test-dockerhubpassword', variable: 'test-dockerhubpass')]) {
                    script {  
                        sh "docker login -u maheshur -p '${test-dockerhubpass}'"
                    }
                }
            }
        }
        stage('Push Images') {
            parallel {
                stage('Push Server Image') {
                    steps {
                        sh "docker push maheshur/student-performance-server:${BUILD_NUMBER}"
                    }
                }
                stage('Push Client Image') {
                    steps {
                        sh "docker push maheshur/student-performance-client:${BUILD_NUMBER}"
                    }
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}
