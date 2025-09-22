import { databaseService } from './databaseService';

export const initializeApp = async (): Promise<void> => {
  try {
    // Initialize the database
    await databaseService.initDatabase();
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Don't throw error - app should still work without database
  }
};

export default initializeApp;