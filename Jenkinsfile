pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-16'
    }
    
    environment {
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git log -n 1 --pretty=format:'%h'",
                        returnStdout: true
                    ).trim()
                    echo "Git commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
            post {
                always {
                    // Archive test results if they exist
                    script {
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh '''
                    # Create build directory
                    mkdir -p dist
                    
                    # Copy source files
                    cp -r src/* dist/
                    cp package.json dist/
                    
                    echo "Build completed at $(date)"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
            
            // Archive build artifacts
            script {
                if (fileExists('dist')) {
                    archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
                }
            }
        }
        
        success {
            echo '✅ Build successful! All tests passed.'
        }
        
        failure {
            echo '❌ Build failed!'
        }
    }
}