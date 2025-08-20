import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Manages user name operations - storing, loading, and updating custom user names
 * Separated from UserManager following Single Responsibility Principle
 */
export class UserNameManager {
  private static instance: UserNameManager;

  private constructor() {}

  static getInstance(): UserNameManager {
    if (!UserNameManager.instance) {
      UserNameManager.instance = new UserNameManager();
    }
    return UserNameManager.instance;
  }

  /**
   * Sanitize email for use as storage key (remove special characters)
   */
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  /**
   * Get custom user name from storage
   */
  async getCustomUserName(email: string | null): Promise<string | null> {
    if (!email) return null;
    
    try {
      const customNameKey = `customName_${this.sanitizeEmail(email)}`;
      return await AsyncStorage.getItem(customNameKey);
    } catch (error) {
      console.error('Error getting custom user name:', error);
      return null;
    }
  }

  /**
   * Save custom user name to storage
   */
  async saveCustomUserName(email: string, name: string): Promise<void> {
    try {
      const customNameKey = `customName_${this.sanitizeEmail(email)}`;
      await AsyncStorage.setItem(customNameKey, name);
      console.log('Custom user name saved successfully:', name);
    } catch (error) {
      console.error('Error saving custom user name:', error);
      throw error;
    }
  }

  /**
   * Save original user name for reset functionality
   */
  async saveOriginalUserName(email: string, name: string): Promise<void> {
    try {
      const originalNameKey = `originalName_${this.sanitizeEmail(email)}`;
      await AsyncStorage.setItem(originalNameKey, name);
    } catch (error) {
      console.error('Error saving original user name:', error);
    }
  }

  /**
   * Get original user name from storage
   */
  async getOriginalUserName(email: string): Promise<string | null> {
    try {
      const originalNameKey = `originalName_${this.sanitizeEmail(email)}`;
      return await AsyncStorage.getItem(originalNameKey);
    } catch (error) {
      console.error('Error getting original user name:', error);
      return null;
    }
  }

  /**
   * Reset user name to original server provided name
   */
  async resetToOriginalUserName(email: string): Promise<string | null> {
    try {
      const originalName = await this.getOriginalUserName(email);
      if (originalName) {
        await this.saveCustomUserName(email, originalName);
      }
      return originalName;
    } catch (error) {
      console.error('Error resetting user name to original:', error);
      throw error;
    }
  }
}

export const userNameManager = UserNameManager.getInstance(); 