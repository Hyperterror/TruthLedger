# Transparent Charitable Giving Ledger (C-DAC)

A blockchain-based donation tracking platform focused on transparency, accountability, and impact measurement using Solidity smart contracts, FastAPI backend, MongoDB, Web3.py, and Next.js frontend with Redux and Chart.js.

---

## 🎯 Overview

C-DAC is designed to build trust in philanthropy by providing an immutable platform showing how donations are transacted, allocated, and utilized. 

### Key Features

- ✅ **Immutable Donation Ledger** - Every donation recorded on Ethereum blockchain
- ✅ **Milestone-Based Fund Distribution** - Funds released only after milestone verification
- ✅ **Role-Based Access Control** - Donors, Charities, Admins with specific permissions
- ✅ **Real-Time Dashboard** - Live donation tracking and analytics with Chart.js
- ✅ **Public Audit Trail** - Anyone can verify transactions on blockchain
- ✅ **Fraud Detection AI** - Anomaly detection for suspicious transactions
- ✅ **Web3 Integration** - MetaMask wallet connection for donors

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│         React + Redux + Chart.js + Tailwind CSS              │
└────────────────────────┬─────────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (FastAPI)                          │
│  MongoDB Indexing │ Web3.py Events │ JWT Auth │ ML Models    │
└────────────────────────┬─────────────────────────────────────┘
                         │ JSON-RPC
┌────────────────────────▼─────────────────────────────────────┐
│                   BLOCKCHAIN (Solidity)                       │
│  DonationToken │ FundAllocation │ ProjectMilestone │ Access   │
│  Ethereum Mainnet & Polygon Testnet                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Solidity, Hardhat, Ethereum (Mainnet), Polygon (Testnet), OpenZeppelin |
| **Backend** | FastAPI, Python, MongoDB, Web3.py, Socket.io, scikit-learn |
| **Frontend** | Next.js, React, Redux Toolkit, Chart.js, Tailwind CSS |
| **Development** | Docker, Git, Vercel, Heroku |

---

## 📋 Project Structure

```
c-dac/
├── c-dac-blockchain/           # Smart contracts
│   ├── contracts/
│   │   ├── AccessControl.sol
│   │   ├── DonationToken.sol
│   │   ├── FundAllocation.sol
│   │   └── ProjectMilestone.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   └── hardhat.config.ts
│
├── c-dac-backend/              # FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   └── main.py
│   ├── models/
│   │   ├── blockchain.py
│   │   ├── project.py
│   │   └── user.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── donations.py
│   │   ├── projects.py
│   │   └── blockchain.py
│   ├── services/
│   │   ├── web3_service.py
│   │   ├── event_listener.py
│   │   └── fraud_detection.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── cdac-frontend/              # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx
    │   │   ├── dashboard/
    │   │   └── donate/
    │   ├── components/
    │   │   ├── DonationChart.tsx
    │   │   ├── DonationTable.tsx
    │   │   └── DonationStats.tsx
    │   ├── store/
    │   │   ├── index.ts
    │   │   └── donationSlice.ts
    │   └── hooks/
    │       └── useWallet.ts
    ├── package.json
    └── .env.local
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Python 3.10+
- MongoDB Atlas account or Docker
- MetaMask wallet
- Git

---

### 1️⃣ Blockchain Setup

```bash
# Clone and navigate
git clone https://github.com/yourusername/c-dac.git
cd c-dac-blockchain

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with RPC URLs and private keys

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Polygon testnet
npx hardhat run scripts/deploy.ts --network polygon_testnet

# Verify contracts
npx hardhat verify --network polygon_testnet <CONTRACT_ADDRESS>
```

**Expected Output:**
```
🚀 Deploying C-DAC Smart Contracts...
✅ AccessControl deployed to: 0x...
✅ DonationToken deployed to: 0x...
✅ FundAllocation deployed to: 0x...
✅ ProjectMilestone deployed to: 0x...
✅ Deployment info saved to deployment-info.json
```

---

### 2️⃣ MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - RECOMMENDED)

```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 free cluster
4. Create database user (admin/password)
5. Whitelist your IP
6. Copy connection string
7. Update .env: DATABASE_URL=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/cdac
```

#### Option B: Docker (Local)

```bash
# In c-dac-backend, run:
docker-compose up -d

# Verify
docker-compose ps

# Access UI: http://localhost:8081
```

#### Option C: Local Installation

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh
```

---

### 3️⃣ Backend Setup

```bash
# Navigate to backend
cd c-dac-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with:
# - DATABASE_URL (from MongoDB Atlas)
# - ETHEREUM_RPC_URL
# - Smart contract addresses (from deployment-info.json)
# - SECRET_KEY (generate: python -c "import secrets; print(secrets.token_urlsafe(32))")

# Initialize MongoDB collections
python scripts/init_mongodb.py

# Seed sample data
python scripts/seed_data.py

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ Connected to MongoDB successfully
✅ Web3 service initialized
✅ Event listener started
```

---

### 4️⃣ Frontend Setup

```bash
# Navigate to frontend
cd cdac-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with:
# - NEXT_PUBLIC_API_URL=http://localhost:8000/api
# - NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws
# - NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Start development server
npm run dev
```

**Visit:** http://localhost:3000

---

## 🧪 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:8000/health

# Get all donations
curl http://localhost:8000/api/donations

# Get donations by cause
curl http://localhost:8000/api/donations/by-cause/Education

# Get statistics
curl http://localhost:8000/api/donations/statistics/summary

# Login with wallet
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x1234567890123456789012345678901234567890"}'
```

### Frontend Testing

```bash
# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

---

## 📱 Usage

### For Donors

1. Visit http://localhost:3000
2. Click "Connect Wallet" (MetaMask)
3. Navigate to "Donate"
4. Select cause and amount
5. Confirm transaction
6. View donation on dashboard

### For Admins

1. Login with admin wallet
2. Navigate to Projects
3. Review milestones
4. Verify and approve fund releases
5. Monitor fraud flags

### For Charities

1. Register charity wallet
2. Create projects with milestones
3. Submit milestone completion proof
4. Receive fund releases automatically

---

## 🌐 Deployment

### Backend Deployment

**Option 1: Heroku**
```bash
heroku create cdac-backend
git push heroku main
```

**Option 2: AWS/DigitalOcean**
```bash
# Build Docker image
docker build -t cdac-backend .

# Push to registry and deploy
```

### Frontend Deployment

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

Or connect GitHub to Vercel dashboard.

### Smart Contracts

For production, deploy to Ethereum mainnet:
```bash
npx hardhat run scripts/deploy.ts --network ethereum_mainnet
```

⚠️ **WARNING:** Use real wallet with mainnet funds. Test thoroughly on testnet first.

---

## 📊 API Documentation

**Interactive Docs:** http://localhost:8000/docs (Swagger UI)

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with wallet |
| GET | `/api/donations` | Get all donations |
| GET | `/api/donations/by-cause/{cause}` | Filter by cause |
| GET | `/api/donations/by-donor/{address}` | Donor's donations |
| GET | `/api/donations/statistics/summary` | Stats |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/blockchain/contracts/addresses` | Contract addresses |

---

## 🔒 Security

- JWT authentication for API endpoints
- Role-based access control on smart contracts
- Private key management via `.env` (never committed)
- MongoDB credentials encrypted
- HTTPS required in production
- Input validation on all routes
- Fraud detection for anomalies

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Use TypeScript/Python for type safety
- Follow ESLint and Pylint rules
- Write tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Blockchain Developer:** Smart contract development
- **Backend Developer:** FastAPI and Web3.py integration
- **Frontend Developer:** React/Next.js UI
- **DevOps:** Deployment and monitoring

---

## 🙏 Acknowledgments

- OpenZeppelin for contract libraries
- Hardhat for development framework
- Polygon for testnet support
- MongoDB Atlas for database hosting
- Vercel for frontend deployment

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@cdac.dev
- Discord: [Join Community](#)

---

## 🎯 Roadmap

- [ ] Integration with Chainlink Oracles for external verification
- [ ] Mobile app for donors
- [ ] Advanced analytics and impact metrics
- [ ] Multi-chain deployment
- [ ] DAO governance for fund allocation
- [ ] Gamification (badges, leaderboards)

---

**Built with ❤️ for transparent philanthropy**

---

## 📚 Resources

- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Web3.py Docs](https://web3py.readthedocs.io/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Last Updated:** October 31, 2025
