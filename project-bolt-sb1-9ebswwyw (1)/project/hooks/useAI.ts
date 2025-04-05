import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { LLama } from '@llama-node/core';
import { RWKVCpp } from '@llama-node/rwkv-cpp';

const MODEL_URL = 'https://huggingface.co/TheBloke/RWKV-4-Raven-1B5-v12-Eng-20230521-ctx4096-GGML/resolve/main/RWKV-4-Raven-1B5-v12-Eng-20230521-ctx4096-GGML-Q4_0.bin';
const MODEL_NAME = 'RWKV-4-Raven-1B5';

export function useAI() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<LLama | null>(null);
  const [modelInfo] = useState({
    name: MODEL_NAME,
    size: '1.5GB',
  });

  useEffect(() => {
    async function initializeModel() {
      if (Platform.OS === 'web') {
        // Web implementation using WebAssembly
        try {
          const llama = new LLama(RWKVCpp);
          await llama.init({
            modelPath: MODEL_URL,
            enableLogging: false,
            seed: 0,
            threads: navigator.hardwareConcurrency || 4,
            contextSize: 1024,
          });
          setModel(llama);
          setIsModelReady(true);
        } catch (error) {
          console.error('Failed to initialize model:', error);
        }
      } else {
        // Native implementation
        try {
          const modelPath = `${FileSystem.documentDirectory}model.bin`;
          const modelExists = await FileSystem.getInfoAsync(modelPath);

          if (!modelExists.exists) {
            // Download model file
            await FileSystem.downloadAsync(MODEL_URL, modelPath);
          }

          const llama = new LLama(RWKVCpp);
          await llama.init({
            modelPath,
            enableLogging: false,
            seed: 0,
            threads: 4,
            contextSize: 1024,
          });
          setModel(llama);
          setIsModelReady(true);
        } catch (error) {
          console.error('Failed to initialize model:', error);
        }
      }
    }

    initializeModel();
  }, []);

  const generateResponse = useCallback(async (prompt: string) => {
    if (!model || !isModelReady) {
      throw new Error('Model not ready');
    }

    setIsLoading(true);
    try {
      const response = await model.completion({
        prompt,
        maxTokens: 200,
        temperature: 0.7,
        topP: 0.9,
        repeatPenalty: 1.1,
      });

      return response.trim();
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error while processing your request.';
    } finally {
      setIsLoading(false);
    }
  }, [model, isModelReady]);

  return {
    isModelReady,
    isLoading,
    generateResponse,
    modelInfo,
  };
}