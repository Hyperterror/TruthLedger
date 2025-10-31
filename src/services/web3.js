import { ethers } from 'ethers';

// Contract ABIs (simplified - you may need to import full ABIs)
const DONATION_TOKEN_ABI = [
  "function donate(string memory cause, uint256 amount) public payable",
  "function balanceOf(address account) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 amount, string cause, uint256 donationId, uint256 timestamp)"
];

const FUND_ALLOCATION_ABI = [
  "function allocateFunds(uint256 projectId, uint256 amount) public",
  "function getProjectBalance(uint256 projectId) public view returns (uint256)"
];

// Contract addresses (from backend config)
const CONTRACT_ADDRESSES = {
  donationToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  fundAllocation: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  projectMilestone: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  accessControl: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
};

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.donationTokenContract = null;
    this.fundAllocationContract = null;
    this.chainId = 80002; // Polygon Amoy testnet
  }

  // Initialize Web3 connection
  async init() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();

        // Initialize contracts
        this.donationTokenContract = new ethers.Contract(
          CONTRACT_ADDRESSES.donationToken,
          DONATION_TOKEN_ABI,
          this.signer
        );

        this.fundAllocationContract = new ethers.Contract(
          CONTRACT_ADDRESSES.fundAllocation,
          FUND_ALLOCATION_ABI,
          this.signer
        );

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
          } else {
            console.log('Account changed:', accounts[0]);
            window.location.reload();
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
          console.log('Chain changed:', chainId);
          window.location.reload();
        });

        return true;
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        return false;
      }
    } else {
      console.error('MetaMask not detected');
      return false;
    }
  }

  // Get current wallet address
  async getAddress() {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  // Get wallet balance
  async getBalance() {
    if (!this.signer) return null;
    const address = await this.getAddress();
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  // Switch to Polygon Amoy network
  async switchToAmoy() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${this.chainId.toString(16)}`,
                chainName: 'Polygon Amoy',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                blockExplorerUrls: ['https://amoy.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Polygon Amoy network:', addError);
        }
      } else {
        console.error('Failed to switch to Polygon Amoy:', switchError);
      }
    }
  }

  // Make a donation
  async makeDonation(amount, cause) {
    if (!this.donationTokenContract) {
      throw new Error('Web3 not initialized');
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount.toString());

      // Call donate function
      const tx = await this.donationTokenContract.donate(cause, amountInWei, {
        value: amountInWei // Since it's payable
      });

      console.log('Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      return {
        success: true,
        txHash: tx.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('Donation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get donation token balance
  async getTokenBalance() {
    if (!this.donationTokenContract) return null;

    try {
      const address = await this.getAddress();
      const balance = await this.donationTokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return null;
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash) {
    if (!this.provider) return null;

    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      return null;
    }
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;
