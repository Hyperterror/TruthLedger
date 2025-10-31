# TODO: Connect Frontend with Backend and Blockchain

## 1. Install Frontend Dependencies
- [x] Install axios for API calls
- [x] Install ethers for blockchain interaction

## 2. Create API Service
- [x] Create src/services/api.js for backend communication
- [x] Add functions for auth, donations, projects, blockchain endpoints

## 3. Create Web3 Service
- [x] Create src/services/web3.js for blockchain interaction
- [x] Add functions for wallet connection, contract calls, transaction handling

## 4. Update Authentication State Management
- [x] Create src/store/authSlice.js for wallet authentication state
- [x] Update src/store/index.js to include auth reducer
- [x] Add Redux Provider to main.jsx for state management

## 5. Update Login/Signup Pages
- [x] Update src/pages/Login.jsx for MetaMask wallet connection
- [x] Update src/pages/Signup.jsx for wallet registration
- [x] Integrate with backend auth API
- [x] Update Navbar to show wallet address when authenticated

## 6. Update Donate Page
- [x] Update src/pages/Donate.jsx for blockchain donation transactions
- [x] Add contract interaction for donation
- [x] Handle transaction confirmation and error states

## 7. Update Dashboard/Donations Pages
- [x] Update src/pages/Dashboard.jsx to fetch data from API
- [x] Update src/pages/Donations.jsx to fetch donations from API
- [x] Apply dark theme styling to all pages

## 8. Integrate WebSocket for Real-time Updates
- [ ] Add WebSocket connection in frontend
- [ ] Update donation state on real-time events
- [ ] Handle connection errors and reconnections

## 9. Test Full Flow
- [ ] Test wallet connection and authentication
- [ ] Test donation transaction on blockchain
- [ ] Test data fetching and real-time updates
- [ ] Verify end-to-end functionality
