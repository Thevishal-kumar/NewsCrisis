import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';

// Create a context to hold wallet information
export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);   // Holds the user's public wallet address
  const [provider, setProvider] = useState(null); // The connection to the blockchain
  const [signer, setSigner] = useState(null);     // The user's wallet, used to sign transactions

  const connectWallet = async () => {
    // Check if the browser has a web3 wallet installed (e.g., Coinbase Wallet extension)
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request access to the user's accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAccount = accounts[0];
        setAccount(userAccount);

        // Create an ethers provider
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        // Get the signer, which is needed to send transactions
        const walletSigner = await web3Provider.getSigner();
        setSigner(walletSigner);

      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      // If no wallet is found, prompt the user to install one
      alert("Please install a Web3 wallet like Coinbase Wallet or MetaMask.");
    }
  };

  // Provide the wallet state and connect function to all child components
  return (
    <WalletContext.Provider value={{ account, provider, signer, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
