import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { uriManager } from './UriManager';

interface ProfilePhotoData {
  uri: string;
  exists: boolean;
}

/**
 * Manages profile photo operations - storing, loading, and deleting custom profile photos
 * Separated from UserManager following Single Responsibility Principle
 */
export class ProfilePhotoManager {
  private static instance: ProfilePhotoManager;

  private constructor() {}

  static getInstance(): ProfilePhotoManager {
    if (!ProfilePhotoManager.instance) {
      ProfilePhotoManager.instance = new ProfilePhotoManager();
    }
    return ProfilePhotoManager.instance;
  }

  /**
   * Sanitize email for use as storage key (remove special characters)
   */
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  /**
   * Get storage key for user's custom profile photo
   */
  private getCustomPhotoKey(userEmail: string): string {
    const sanitizedEmail = this.sanitizeEmail(userEmail);
    return `customProfilePhoto_${sanitizedEmail}`;
  }

  /**
   * Get storage key for user's profile photo deletion preference
   */
  private getPhotoDeletedKey(userEmail: string): string {
    const sanitizedEmail = this.sanitizeEmail(userEmail);
    return `photoDeleted_${sanitizedEmail}`;
  }

  /**
   * Get storage key for user's effective original profile photo (for email/Apple users)
   */
  private getEffectiveOriginalPhotoKey(userEmail: string): string {
    const sanitizedEmail = this.sanitizeEmail(userEmail);
    return `effectiveOriginalPhoto_${sanitizedEmail}`;
  }

  /**
   * Save a custom profile photo for a user
   */
  async saveCustomProfilePhoto(userEmail: string, photoUri: string): Promise<string> {
    try {
      // Normalize the input URI using UriManager
      const normalizedInputUri = uriManager.normalizeUriForOperation(photoUri, 'check');
      
      // Verify source file exists
      const sourceExists = await uriManager.findExistingFileUri(normalizedInputUri);
      if (!sourceExists.exists || !sourceExists.workingUri) {
        throw new Error(`Source photo file not found: ${photoUri}`);
      }

      // Create permanent file path in Documents directory
      const sanitizedEmail = this.sanitizeEmail(userEmail);
      const fileName = `profile_${sanitizedEmail}_${Date.now()}.jpg`;
      const permanentPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // Normalize source and destination URIs for copy operation
      const sourceUriForCopy = uriManager.normalizeUriForOperation(sourceExists.workingUri, 'save');
      const destUriForCopy = uriManager.normalizeUriForOperation(permanentPath, 'save');
      
      // Copy from source location to permanent location
      await RNFS.copyFile(sourceUriForCopy, destUriForCopy);
      
      // Create properly normalized URI for storage and display
      const permanentUri = uriManager.normalizeUriForOperation(permanentPath, 'display');
      
      // Delete old custom profile photo if exists
      await this.deleteExistingCustomPhoto(userEmail);

      // Save custom profile photo URI to storage
      const customPhotoKey = this.getCustomPhotoKey(userEmail);
      await AsyncStorage.setItem(customPhotoKey, permanentUri);
      
      // Clear photo deleted flag when user sets a new photo
      const photoDeletedKey = this.getPhotoDeletedKey(userEmail);
      await AsyncStorage.removeItem(photoDeletedKey);
      
      // For email/Apple users (no server photo), set this as their effective original photo if not already set
      const originalPhoto = await this.getOriginalProfilePhoto(userEmail);
      if (!originalPhoto) {
        const effectiveOriginalKey = this.getEffectiveOriginalPhotoKey(userEmail);
        const existingEffectiveOriginal = await AsyncStorage.getItem(effectiveOriginalKey);
        if (!existingEffectiveOriginal) {
          await AsyncStorage.setItem(effectiveOriginalKey, permanentUri);
          console.log('Set effective original photo for email/Apple user:', permanentUri);
        }
      }
      
      console.log('Profile photo saved successfully:', permanentUri);
      return permanentUri;
    } catch (error) {
      console.error('Error saving custom profile photo:', error);
      throw error;
    }
  }

  /**
   * Load custom profile photo for a user
   */
  async loadCustomProfilePhoto(userEmail: string): Promise<ProfilePhotoData> {
    try {
      const customPhotoKey = this.getCustomPhotoKey(userEmail);
      const storedUri = await AsyncStorage.getItem(customPhotoKey);
      
      if (!storedUri) {
        return { uri: '', exists: false };
      }

      // Use UriManager to verify the file still exists and get working URI
      const fileCheck = await uriManager.findExistingFileUri(storedUri);
      
      if (!fileCheck.exists || !fileCheck.workingUri) {
        // File doesn't exist, clear the reference
        console.warn('Custom profile photo file not found, clearing reference');
        await AsyncStorage.removeItem(customPhotoKey);
        return { uri: '', exists: false };
      }
      
      // Use the working URI found by UriManager (may be different from stored URI due to path changes)
      const workingDisplayUri = uriManager.normalizeUriForOperation(fileCheck.workingUri, 'display');
      
      // If the working URI is different from stored URI, update storage
      if (workingDisplayUri !== storedUri) {
        await AsyncStorage.setItem(customPhotoKey, workingDisplayUri);
        console.log('Updated stored profile photo URI to working URI:', workingDisplayUri);
      }
      
      return { uri: workingDisplayUri, exists: true };
    } catch (error) {
      console.error('Error loading custom profile photo:', error);
      return { uri: '', exists: false };
    }
  }

  /**
   * Delete existing custom profile photo for a user
   */
  private async deleteExistingCustomPhoto(userEmail: string): Promise<void> {
    try {
      const customPhotoKey = this.getCustomPhotoKey(userEmail);
      const storedUri = await AsyncStorage.getItem(customPhotoKey);
      
      if (storedUri) {
        const fileCheck = await uriManager.findExistingFileUri(storedUri);
        if (fileCheck.exists && fileCheck.workingUri) {
          const pathForDelete = uriManager.normalizeUriForOperation(fileCheck.workingUri, 'delete');
          await RNFS.unlink(pathForDelete);
        }
      }
    } catch (error) {
      console.warn('Could not delete existing custom profile photo:', error);
    }
  }

  /**
   * Clear custom profile photo for a user
   */
  async clearCustomProfilePhoto(userEmail: string): Promise<void> {
    try {
      const customPhotoKey = this.getCustomPhotoKey(userEmail);
      
      // Delete the physical file
      await this.deleteExistingCustomPhoto(userEmail);
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(customPhotoKey);
      
      // Set flag to indicate user deliberately deleted their photo
      const photoDeletedKey = this.getPhotoDeletedKey(userEmail);
      await AsyncStorage.setItem(photoDeletedKey, 'true');
      
      console.log('Custom profile photo cleared for user:', userEmail);
    } catch (error) {
      console.error('Error clearing custom profile photo:', error);
      throw error;
    }
  }

  /**
   * Save original profile photo for reset functionality
   */
  async saveOriginalProfilePhoto(userEmail: string, photoUri: string): Promise<void> {
    try {
      const originalPhotoKey = `originalPhoto_${this.sanitizeEmail(userEmail)}`;
      await AsyncStorage.setItem(originalPhotoKey, photoUri);
    } catch (error) {
      console.error('Error saving original profile photo:', error);
    }
  }

  /**
   * Get original profile photo from storage
   */
  async getOriginalProfilePhoto(userEmail: string): Promise<string | null> {
    try {
      const originalPhotoKey = `originalPhoto_${this.sanitizeEmail(userEmail)}`;
      return await AsyncStorage.getItem(originalPhotoKey);
    } catch (error) {
      console.error('Error getting original profile photo:', error);
      return null;
    }
  }

  /**
   * Clear only the custom profile photo file and storage reference without setting deleted flag
   * Used internally for reset operations
   */
  private async clearCustomProfilePhotoForReset(userEmail: string): Promise<void> {
    try {
      const customPhotoKey = this.getCustomPhotoKey(userEmail);
      
      // Delete the physical file
      await this.deleteExistingCustomPhoto(userEmail);
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(customPhotoKey);
      
      console.log('Custom profile photo cleared for reset for user:', userEmail);
    } catch (error) {
      console.error('Error clearing custom profile photo for reset:', error);
      throw error;
    }
  }

  /**
   * Reset profile photo to original server provided photo
   */
  async resetToOriginalProfilePhoto(userEmail: string): Promise<string | null> {
    try {
      // Clear custom profile photo without setting deleted flag
      await this.clearCustomProfilePhotoForReset(userEmail);
      
      // Clear the photo deleted flag since user is resetting to original
      const photoDeletedKey = this.getPhotoDeletedKey(userEmail);
      await AsyncStorage.removeItem(photoDeletedKey);
      
      // Get original photo from storage
      let originalPhoto = await this.getOriginalProfilePhoto(userEmail);
      
      // If no server original photo, check for effective original photo (for email/Apple users)
      if (!originalPhoto) {
        const effectiveOriginalKey = this.getEffectiveOriginalPhotoKey(userEmail);
        originalPhoto = await AsyncStorage.getItem(effectiveOriginalKey);
      }
      
      console.log('Profile photo reset to original photo:', originalPhoto);
      return originalPhoto;
    } catch (error) {
      console.error('Error resetting profile photo to default:', error);
      throw error;
    }
  }

  /**
   * Check if user has deliberately deleted their profile photo
   */
  async hasUserDeletedPhoto(userEmail: string): Promise<boolean> {
    try {
      const photoDeletedKey = this.getPhotoDeletedKey(userEmail);
      const isDeleted = await AsyncStorage.getItem(photoDeletedKey);
      return isDeleted === 'true';
    } catch (error) {
      console.error('Error checking if user deleted photo:', error);
      return false;
    }
  }

  /**
   * Get effective original profile photo for email/Apple users
   */
  async getEffectiveOriginalProfilePhoto(userEmail: string): Promise<string | null> {
    try {
      const effectiveOriginalKey = this.getEffectiveOriginalPhotoKey(userEmail);
      return await AsyncStorage.getItem(effectiveOriginalKey);
    } catch (error) {
      console.error('Error getting effective original profile photo:', error);
      return null;
    }
  }
}

export const profilePhotoManager = ProfilePhotoManager.getInstance(); 