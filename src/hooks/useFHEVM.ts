import { useState, useEffect } from 'react';

// FHEVM integration hook
export const useFHEVM = () => {
  const [isFHEVMReady, setIsFHEVMReady] = useState(false);
  const [fhevmInstance, setFhevmInstance] = useState<any>(null);

  useEffect(() => {
    const initializeFHEVM = async () => {
      try {
        // Check if FHEVM is available
        if (typeof window !== 'undefined' && (window as any).fhevm) {
          const fhevm = (window as any).fhevm;
          setFhevmInstance(fhevm);
          setIsFHEVMReady(true);
        } else {
          console.warn('FHEVM not available');
        }
      } catch (error) {
        console.error('Error initializing FHEVM:', error);
      }
    };

    initializeFHEVM();
  }, []);

  // Encrypt data using FHEVM
  const encrypt = async (data: string): Promise<Uint8Array> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }

    try {
      // Convert string to bytes
      const dataBytes = new TextEncoder().encode(data);
      
      // Encrypt using FHEVM
      const encrypted = await fhevmInstance.encrypt(dataBytes);
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  };

  // Decrypt data using FHEVM
  const decrypt = async (encryptedData: Uint8Array): Promise<string> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }

    try {
      // Decrypt using FHEVM
      const decrypted = await fhevmInstance.decrypt(encryptedData);
      
      // Convert bytes back to string
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  };

  // Generate zero-knowledge proof
  const generateProof = async (data: any, proofType: string): Promise<Uint8Array> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }

    try {
      // Generate proof based on type
      const proof = await fhevmInstance.generateProof(data, proofType);
      return proof;
    } catch (error) {
      console.error('Proof generation error:', error);
      throw error;
    }
  };

  // Verify encrypted computation
  const verifyComputation = async (
    encryptedInput: Uint8Array,
    encryptedOutput: Uint8Array,
    operation: string
  ): Promise<boolean> => {
    if (!fhevmInstance) {
      throw new Error('FHEVM not initialized');
    }

    try {
      const isValid = await fhevmInstance.verifyComputation(
        encryptedInput,
        encryptedOutput,
        operation
      );
      return isValid;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  return {
    isFHEVMReady,
    fhevmInstance,
    encrypt,
    decrypt,
    generateProof,
    verifyComputation,
  };
};
