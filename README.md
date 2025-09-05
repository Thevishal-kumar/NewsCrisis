NewsForge: A Web3-powered misinformation verification platform that analyzes URLs/text with ML, escalates edge cases to a wallet‑gated community for human review, and channels verified stories to transparent, blockchain‑tracked donations.

Models and Services Implemented  
- ML Inference Service (Python): Loads a trained joblib model to score authenticity for URL/text inputs and returns probability + label for routing.
- Training Pipeline (Python): Uses reports_dataset.csv to fit the misinformation model; outputs misinformation_model.joblib for the inference API.
- Node/Express API: Broker between client and ML; manages analyze endpoints, community queue, voting, and donation initialization.
- Vite + JavaScript Client: Dashboard (KPIs and system health), ML Reports (ingest & analyze), Community Verification Queue, and Donations portal.

Core Screens  
- Dashboard: Real‑time counters (Total Verified Reports, Active Threats, Total Donations, Missions Funded) and System Health (Model Accuracy, Uptime).
- ML Reports: Paste URL/text, click Analyze Authenticity, view confidence score; uncertain items escalate to the community queue.
- Community Queue: Wallet connect required; shows items with probability, votes, and quorum status for finalization
- Donations Portal: Wallet connect and mission selection; designed for on‑chain traceability of funds and milestones.

Feature Highlights  
- Wallet/Allowlist Gating: Reviewer participation is restricted to connected wallets and optional allowlists for Sybil resistance and sensitive topics.
- Human‑in‑the‑Loop: ML handles first‑pass triage; reviewers adjudicate uncertain cases to improve precision and create training feedback loops
- Transparent Impact: Verified stories can be linked to donation campaigns, enabling end‑to‑end visibility from claim to funded relief.

Business Model  
- SaaS + Usage: Subscriptions for organizations with usage‑based analysis credits via dashboard/API for URL/text checks.
- Verification Credits: Paid escalation to wallet‑gated reviewer cohorts with configurable quorum and response SLAs; private allowlisted queues for enterprise.
- Donation Fees: Small processing fee on blockchain‑tracked donations plus optional integration fees for payment rails.

Tech Stack  
- Frontend: Vite, JavaScript, Tailwind, ESLint (see client/).
- Backend: Node.js, Express, TypeScript (see server/).
- ML: Python, scikit‑learn, pandas, joblib; train_model.py and predict.py (see ml/).

Repository Structure  
- client/ — Vite + JS app with views for Dashboard, ML Reports, Queue, Donations.
- server/ — Express API for analyze, queue, voting, donations; .env and scripts included.
- ml/ — reports_dataset.csv, train_model.py, predict.py, misinformation_model.joblib.

Requirements  
- Node.js and npm for client/server.
- Python and pip for ML service; recommended virtual environment.

Screenshots
<img width="1728" height="792" alt="Screenshot 2025-09-05 130810" src="https://github.com/user-attachments/assets/0589b57b-82f4-4a80-bd7a-3408c83d56ef" />
<img width="1460" height="822" alt="Screenshot 2025-09-05 130834" src="https://github.com/user-attachments/assets/9cdd1cda-42a8-464e-93db-651fd84135dc" />
<img width="1499" height="835" alt="Screenshot 2025-09-05 130848" src="https://github.com/user-attachments/assets/291960d8-fe6c-4dc9-aa82-26234cb39ccf" />
<img width="1584" height="822" alt="Screenshot 2025-09-05 130856" src="https://github.com/user-attachments/assets/0f2acaec-ead2-40f3-8bf7-cadaea1bdf3d" />

How to Run (Local)  
1) Clone  
- git clone [https://github.com/<org>/<repo>.git](https://github.com/Thevishal-kumar/war-crisis.git) && cd <repo>

2) Install  
- Frontend: cd client && npm install
- Server: cd server && npm install
- ML: cd ml && (create venv) && pip install scikit-learn pandas joblib fastapi uvicorn  # adjust to your codebase

3) Prepare ML  
- Place dataset at ml/reports_dataset.csv(https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification?resource=download)
- Train: python train_model.py  # writes misinformation_model.joblib
- Start inference API: python predict.py  OR uvicorn predict:app --port 8000

4) Environment  
- client/.env: VITE_API_BASE_URL=http://localhost:3000
- server/.env: PORT=3000, ML_SERVICE_URL=http://localhost:8000

5) Start Dev Servers  
- Frontend: cd client && npm run dev
- Server: cd server && npm run dev

Data Flow  
- Client sends /api/analyze with URL/text → Server calls ML /predict → confidence returned → if uncertain, Server enqueues item → Community Queue shows item, wallet reviewers vote → quorum finalizes decision → Donations page links verified stories to campaigns.

Evaluation & Metrics (Example)  
- Model Accuracy surfaced on Dashboard; track precision/recall offline via train/test split; expose confidence thresholds in predict.py for routing.
Roadmap  
- Reviewer reputation and weighted quorum; exportable audit logs for enterprise; on‑chain events for verification milestones; CI for lint/tests/model smoke checks.
