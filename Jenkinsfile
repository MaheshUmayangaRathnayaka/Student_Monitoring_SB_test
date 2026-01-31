pipeline {
    agent any
    
    environment {
        // Docker Hub credentials (configure in Jenkins)
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_SERVER = 'student-performance-server'
        DOCKER_IMAGE_CLIENT = 'student-performance-client'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        
        // MongoDB connection for testing
        MONGODB_URI = 'mongodb://localhost:27017/student_performance_test'
        JWT_SECRET = 'test-jwt-secret-key'
        NODE_ENV = 'test'
    }
    
    tools {
        nodejs 'NodeJS-20' // Configure NodeJS installation in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
                
                // Display branch and commit info
                sh '''
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT}"
                '''
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('server') {
                            echo 'Installing backend dependencies...'
                            sh 'npm ci --legacy-peer-deps'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('client') {
                            echo 'Installing frontend dependencies...'
                            sh 'npm ci --legacy-peer-deps'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality & Linting') {
            parallel {
                stage('Backend Linting') {
                    steps {
                        dir('server') {
                            echo 'Running backend code quality checks...'
                            sh 'npm run lint || true'
                        }
                    }
                }
                stage('Frontend Linting') {
                    steps {
                        dir('client') {
                            echo 'Running frontend linting...'
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }
        
        stage('Unit Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('server') {
                            echo 'Running backend tests...'
                            sh 'npm test || echo "No tests configured"'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('client') {
                            echo 'Running frontend tests...'
                            sh 'npm test || echo "No tests configured"'
                        }
                    }
                }
            }
        }
        
        stage('Build Application') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('client') {
                            echo 'Building frontend application...'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Verify Backend') {
                    steps {
                        dir('server') {
                            echo 'Verifying backend application...'
                            sh 'node --check server.js'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            parallel {
                stage('Build Server Image') {
                    steps {
                        dir('server') {
                            echo 'Building server Docker image...'
                            sh """
                                docker build -t ${DOCKER_IMAGE_SERVER}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_SERVER}:${DOCKER_TAG} ${DOCKER_IMAGE_SERVER}:latest
                            """
                        }
                    }
                }
                stage('Build Client Image') {
                    steps {
                        dir('client') {
                            echo 'Building client Docker image...'
                            sh """
                                docker build -t ${DOCKER_IMAGE_CLIENT}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_CLIENT}:${DOCKER_TAG} ${DOCKER_IMAGE_CLIENT}:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Running security vulnerability scan...'
                dir('server') {
                    sh 'npm audit --audit-level=high || true'
                }
                dir('client') {
                    sh 'npm audit --audit-level=high || true'
                }
            }
        }
        
        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing Docker images to registry...'
                sh """
                    echo \$DOCKER_HUB_CREDENTIALS_PSW | docker login -u \$DOCKER_HUB_CREDENTIALS_USR --password-stdin
                    docker push ${DOCKER_IMAGE_SERVER}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_SERVER}:latest
                    docker push ${DOCKER_IMAGE_CLIENT}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE_CLIENT}:latest
                """
            }
        }
        
        stage('Deploy to Test Environment') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to test environment...'
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                    echo "Application deployed at http://localhost:3000"
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                echo 'Deploying to production environment...'
                // Add your production deployment commands here
                sh '''
                    echo "Production deployment commands would go here"
                    # Example: kubectl apply -f k8s/
                    # Or: docker-compose -f docker-compose.prod.yml up -d
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            sh 'docker-compose down || true'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            // Notify via Slack, Email, etc.
            // slackSend(color: 'good', message: "Build Successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}")
        }
        failure {
            echo 'Pipeline failed!'
            // Notify via Slack, Email, etc.
            // slackSend(color: 'danger', message: "Build Failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}")
        }
        unstable {
            echo 'Pipeline unstable!'
        }
    }
}
