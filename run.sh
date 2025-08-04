#!/bin/bash

# Daily Journal App - Quick Start Script
# This script helps you get the application running quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Docker
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first:"
        echo "  - macOS: https://docs.docker.com/docker-for-mac/install/"
        echo "  - Windows: https://docs.docker.com/docker-for-windows/install/"
        echo "  - Linux: https://docs.docker.com/engine/install/"
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Function to check Docker Compose
check_docker_compose() {
    print_status "Checking Docker Compose..."
    
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose:"
        echo "  https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Docker Compose is available"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_success "Created .env file. You can customize it if needed."
    else
        print_warning ".env file already exists"
    fi
}

# Function to build and run with Docker Compose
run_docker_compose() {
    print_status "Building and starting the application with Docker Compose..."
    
    # Stop any existing containers
    docker-compose down >/dev/null 2>&1 || true
    
    # Build and start
    if docker-compose up --build -d; then
        print_success "Application started successfully!"
        print_status "Application is available at:"
        echo "  🌐 Frontend: http://localhost:3000"
        echo "  ❤️  Health Check: http://localhost:3000/health"
        echo ""
        print_status "To view logs:"
        echo "  docker-compose logs -f"
        echo ""
        print_status "To stop the application:"
        echo "  docker-compose down"
    else
        print_error "Failed to start the application"
        exit 1
    fi
}

# Function to run development mode
run_development() {
    print_status "Starting development environment with hot reload..."
    
    # Stop any existing containers
    docker-compose down >/dev/null 2>&1 || true
    
    # Start development environment
    if docker-compose --profile development up --build -d; then
        print_success "Development environment started!"
        print_status "Development server is available at:"
        echo "  🔧 Development: http://localhost:3001 (with hot reload)"
        echo "  🌐 Production: http://localhost:3000"
        echo ""
        print_status "To view development logs:"
        echo "  docker-compose logs -f daily-journal-dev"
    else
        print_error "Failed to start development environment"
        exit 1
    fi
}

# Function to run without Docker (local development)
run_local() {
    print_status "Starting local development (without Docker)..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 16+ first:"
        echo "  - Download from: https://nodejs.org/"
        echo "  - Or use nvm: https://github.com/nvm-sh/nvm"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "16" ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Start development server
    print_status "Starting development server..."
    npm start
}

# Function to show status
show_status() {
    print_status "Application Status:"
    echo ""
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Application is running"
        docker-compose ps
        echo ""
        print_status "Access points:"
        echo "  🌐 http://localhost:3000"
        echo "  ❤️  http://localhost:3000/health"
        
        # Check if development container is also running
        if docker-compose ps | grep -q "daily-journal-dev.*Up"; then
            echo "  🔧 http://localhost:3001 (development)"
        fi
    else
        print_warning "Application is not running"
        echo "Run './run.sh start' to start the application"
    fi
}

# Function to stop application
stop_application() {
    print_status "Stopping application..."
    
    if docker-compose down; then
        print_success "Application stopped"
    else
        print_warning "Failed to stop application or it wasn't running"
    fi
}

# Function to view logs
view_logs() {
    print_status "Showing application logs (Press Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    print_status "Stopping and removing containers..."
    docker-compose down -v
    
    print_status "Removing application images..."
    docker rmi $(docker images -q "daily-journal*") 2>/dev/null || true
    
    print_status "Pruning unused Docker resources..."
    docker system prune -f
    
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Daily Journal App - Quick Start Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start, run      Start the application (production mode)"
    echo "  dev             Start development environment with hot reload"
    echo "  local           Run locally without Docker"
    echo "  stop            Stop the application"
    echo "  status          Show application status"
    echo "  logs            View application logs"
    echo "  clean           Clean up Docker resources"
    echo "  help, -h        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start        # Start the application"
    echo "  $0 dev          # Start with development hot reload"
    echo "  $0 local        # Run without Docker"
    echo "  $0 logs         # View logs"
    echo "  $0 clean        # Clean up resources"
    echo ""
    echo "First time setup:"
    echo "  1. Ensure Docker is installed and running"
    echo "  2. Run: $0 start"
    echo "  3. Open: http://localhost:3000"
    echo ""
    print_status "For more information, see README.md"
}

# Main script logic
main() {
    local command=${1:-start}
    
    case $command in
        start|run)
            check_docker
            check_docker_compose
            setup_environment
            run_docker_compose
            ;;
        dev|development)
            check_docker
            check_docker_compose
            setup_environment
            run_development
            ;;
        local)
            setup_environment
            run_local
            ;;
        stop)
            stop_application
            ;;
        status)
            show_status
            ;;
        logs)
            view_logs
            ;;
        clean|cleanup)
            cleanup
            ;;
        help|-h|--help)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Print banner
echo "════════════════════════════════════════════════════════════════"
echo "  📝 Daily Journal App - Intelligent Video Journaling"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Run main function with all arguments
main "$@"