.PHONY: help train validate api frontend docker-up docker-down install lint

# ── Default target ─────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  Ethiopian Salary Prediction — Available Commands"
	@echo "  ================================================"
	@echo "  make install        Install all Python + Node dependencies"
	@echo "  make train          Train the salary prediction model"
	@echo "  make validate       Validate the dataset"
	@echo "  make api            Run the FastAPI backend (dev)"
	@echo "  make frontend       Run the Next.js frontend (dev)"
	@echo "  make docker-up      Start all services with Docker Compose"
	@echo "  make docker-down    Stop all Docker services"
	@echo "  make lint           Run Python linting"
	@echo ""

# ── Install dependencies ───────────────────────────────────────────────────────
install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

# ── ML Pipeline ───────────────────────────────────────────────────────────────
train:
	@echo "🤖 Training salary prediction model..."
	python src/train.py

validate:
	@echo "🔍 Validating dataset..."
	python src/validate.py

pipeline:
	@echo "🚀 Running full model training pipeline..."
	python src/pipeline.py

# ── Backend ───────────────────────────────────────────────────────────────────
api:
	@echo "⚙️  Starting FastAPI backend on http://localhost:8000 ..."
	cd backend && uvicorn app:app --host 0.0.0.0 --port 8000 --reload \
		--env-var MODEL_PATH=../models/best_ethiopian_salary_model.pkl \
		--env-var DATA_PATH=../data/raw/ethiopia_salary_data.csv

# ── Frontend ──────────────────────────────────────────────────────────────────
frontend:
	@echo "🖥️  Starting Next.js frontend on http://localhost:3000 ..."
	cd frontend && npm run dev

# ── Docker ────────────────────────────────────────────────────────────────────
docker-up:
	@echo "🐳 Starting all services..."
	docker-compose up --build -d

docker-down:
	@echo "🛑 Stopping all services..."
	docker-compose down

# ── Linting ───────────────────────────────────────────────────────────────────
lint:
	python -m flake8 src/ backend/ --max-line-length=120 --ignore=E501
