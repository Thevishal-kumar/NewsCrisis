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
<img width="1726" height="713" alt="Screenshot 2025-09-05 130417" src="https://github.com/user-attachments/assets/08812df4-488b-4b0e-b1d0-7e6195987856" />
<img width="1725" height="809" alt="Screenshot 2025-09-05 130406" src="https://github.com/user-attachments/assets/c226be15-22b2-4e6b-b09b-784f79e20d96" />
<img width="1735" height="828" alt="Screenshot 2025-09-05 130358" src="https://github.com/user-attachments/assets/09b2e532-6812-4914-9c01-979f5ded44b3" />
<img width="1888" height="674" alt="Screenshot 2025-09-05 122443" src="https://github.com/user-attachments/assets/42f285c0-3eb2-4c66-a640-8d3f9e1bbca6" />
<img width="1716" height="838" alt="Screenshot 2025-09-05 130427" src="https://github.com/user-attachments/assets/21bf2e92-4045-452c-9095-8fa3d1daf814" />



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
