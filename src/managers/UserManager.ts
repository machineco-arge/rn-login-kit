import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserInfo, UserInitializationCallback } from '../types';
import { profilePhotoManager } from './ProfilePhotoManager';
import { userNameManager } from './UserNameManager';

type UserUpdateListener = (user: IUserInfo | null) => void;

class UserManager {
  private static instance: UserManager;
  private currentUser: IUserInfo | null = null;
  private listeners: Set<UserUpdateListener> = new Set();
  private userInitializationCallback: UserInitializationCallback | null = null;


  private constructor() {}

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  /**
   * Set callback for user-dependent services initialization
   * This allows the main app to initialize app-specific services when user is loaded
   */
  setUserInitializationCallback(callback: UserInitializationCallback | null): void {
    this.userInitializationCallback = callback;
  }

  /**
   * Subscribe to user updates
   */
  subscribe(listener: UserUpdateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of user updates
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentUser);
      } catch (error) {
        console.error('Error in user update listener:', error);
      }
    });
  }

  /**
   * Initialize the user manager by loading user info from storage
   */
  async initialize(): Promise<void> {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        this.currentUser = JSON.parse(storedUserInfo);
        
        // Load custom profile photo if exists
        await this.loadCustomProfilePhoto();
        
        // Notify listeners after initialization
        this.notifyListeners();
        
        // Initialize user-dependent services
        await this.initializeUserDependentServices();
      }
    } catch (error) {
      console.error('Error initializing UserManager:', error);
      this.currentUser = null;
    }
  }

  /**
   * Initialize services that depend on user being logged in
   * Calls the app-specific initialization callback if provided
   */
  private async initializeUserDependentServices(): Promise<void> {
    try {
      // Call app-specific user initialization callback if provided
      if (this.userInitializationCallback) {
        await this.userInitializationCallback();
      }
      
      console.log('User-dependent services initialized');
    } catch (error) {
      console.error('Error initializing user-dependent services:', error);
    }
  }

  /**
   * Load custom profile photo from storage using ProfilePhotoManager
   */
  private async loadCustomProfilePhoto(): Promise<void> {
    if (!this.currentUser?.email) return;
    
    try {
      // Check if user has deliberately deleted their photo
      const hasDeletedPhoto = await profilePhotoManager.hasUserDeletedPhoto(this.currentUser.email);
      if (hasDeletedPhoto) {
        // User has deliberately deleted their photo, don't load any photo
        if (this.currentUser) {
          this.currentUser.photo = null;
          await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
        }
        return;
      }
      
      const photoData = await profilePhotoManager.loadCustomProfilePhoto(this.currentUser.email);
      
      if (photoData.exists) {
        // Update current user with custom photo
        if (this.currentUser) {
          this.currentUser.photo = photoData.uri;
          await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
        }
      }
    } catch (error) {
      console.error('Error loading custom profile photo:', error);
    }
  }

  /**
   * Get the current user information
   */
  getCurrentUser(): IUserInfo | null {
    return this.currentUser;
  }

  /**
   * Get the current user token from storage
   * Used for session validation
   */
  async getUserToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }

  /**
   * Get the current user's email for storage scoping
   * Returns a sanitized email that can be used as a storage key
   */
  getCurrentUserEmail(): string | null {
    if (!this.currentUser?.email) {
      return null;
    }
    // Sanitize email for use as storage key (remove special characters)
    return this.sanitizeEmail(this.currentUser.email);
  }


  /**
   * Set the current user (called when user logs in)
   * This will preserve custom name and profile photo
   */
  async setCurrentUser(user: IUserInfo, onGetUserName?: () => Promise<string | null>): Promise<void> {
    console.log('[UserManager] Starting setCurrentUser for email:', user.email);

    // Step 1: Immediately persist the user object with the token.
    // This makes the token available for any subsequent API calls during this process.
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    if (user.idToken) {
      await AsyncStorage.setItem('userToken', user.idToken);
      console.log('[UserManager] Provisional user info with token saved to storage.');
    }

    if (user.email && user.photo) {
      await profilePhotoManager.saveOriginalProfilePhoto(user.email, user.photo);
    }

    if (user.email && user.name) {
      await userNameManager.saveOriginalUserName(user.email, user.name);
    }
    
    const hasDeletedPhoto = user.email ? await profilePhotoManager.hasUserDeletedPhoto(user.email) : false;
    
    // Step 2: Determine the user's name.
    const customName = await userNameManager.getCustomUserName(user.email);
    let finalUserName = customName;
    console.log(`[UserManager] Found local custom name: "${finalUserName}"`);

    if (!finalUserName && user.email && onGetUserName) {
      console.log('[UserManager] No local name. Calling onGetUserName...');
      try {
        const serverName = await onGetUserName();
        console.log(`[UserManager] onGetUserName returned: "${serverName}"`);
        if (serverName) {
          finalUserName = serverName;
          await userNameManager.saveCustomUserName(user.email, serverName);
          await userNameManager.saveOriginalUserName(user.email, serverName);
          console.log(`[UserManager] Using server name and saved it locally: "${finalUserName}"`);
        }
      } catch (error) {
        console.error('[UserManager] Error calling onGetUserName:', error);
      }
    }

    // Step 3: If no name from local storage or server, use the fallback.
    if (!finalUserName) {
        finalUserName = user.name; // Fallback name from initial login (e.g., email prefix)
        console.log(`[UserManager] No local or server name. Using fallback: "${finalUserName}"`);
    }
    
    // Step 4: Determine profile photo.
    let profilePhoto = user.photo;
    if (hasDeletedPhoto) {
      // User has deliberately deleted their photo
      profilePhoto = null;
    } else if (!user.photo && user.email) {
      // Server photo is null, check for effective original photo (for email/Apple users)
      const effectiveOriginalPhoto = await profilePhotoManager.getEffectiveOriginalProfilePhoto(user.email);
      if (effectiveOriginalPhoto) {
        profilePhoto = effectiveOriginalPhoto;
        console.log('Using effective original photo for email/Apple user:', effectiveOriginalPhoto);
      }
    }
    
    // Step 5: Construct the final user object.
    this.currentUser = {
      ...user,
      name: finalUserName,
      photo: profilePhoto,
    };
    console.log('[UserManager] Final user object constructed:', this.currentUser);
    
    // After setting user, check if there's a custom profile photo (only if user hasn't deleted photo)
    if (!hasDeletedPhoto) {
      await this.loadCustomProfilePhoto();
    }
    
    // Step 6: Persist the final, complete user object to storage.
    await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
    console.log('[UserManager] Final user info saved to storage.');
    
    this.notifyListeners();
  }

  /**
   * Sanitize email for use as storage key (remove special characters)
   */
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  /**
   * Update user profile photo - delegates to ProfilePhotoManager
   */
  async updateProfilePhoto(photoUri: string): Promise<void> {
    if (!this.currentUser?.email) {
      throw new Error('No user logged in');
    }

    try {
      // Use ProfilePhotoManager to save the photo
      const permanentUri = await profilePhotoManager.saveCustomProfilePhoto(this.currentUser.email, photoUri);
      
      // Update state
      this.currentUser.photo = permanentUri;
      
      // Persist to storage
      await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
      
      // Notify listeners of the change
      this.notifyListeners();
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw error;
    }
  }

  /**
   * Clear profile photo completely - delegates to ProfilePhotoManager
   */
  async clearProfilePhoto(): Promise<void> {
    if (!this.currentUser?.email) return;
    
    try {
      // Use ProfilePhotoManager to clear the photo
      await profilePhotoManager.clearCustomProfilePhoto(this.currentUser.email);
      
      this.currentUser.photo = null;
      await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
      
      // Notify listeners of the change
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing profile photo:', error);
    }
  }

  /**
   * Reset profile photo to original - delegates to ProfilePhotoManager
   */
  async resetToDefaultProfilePhoto(): Promise<void> {
    if (!this.currentUser?.email) return;
    
    try {
      // Use ProfilePhotoManager to reset the photo
      const originalPhoto = await profilePhotoManager.resetToOriginalProfilePhoto(this.currentUser.email);
      
      this.currentUser.photo = originalPhoto;
      await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
      
      // Notify listeners of the change
      this.notifyListeners();
    } catch (error) {
      console.error('Error resetting profile photo to default:', error);
      throw error;
    }
  }

  /**
   * Update user name with optional server sync
   */
  async updateUserName(newName: string, onUserNameUpdate?: (newName: string) => Promise<void>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    try {
      // First update locally
      this.currentUser.name = newName;
      
      // Store custom name using UserNameManager
      if (this.currentUser.email) {
        await userNameManager.saveCustomUserName(this.currentUser.email, newName);
      }
      
      // Persist to storage
      await AsyncStorage.setItem('userInfo', JSON.stringify(this.currentUser));
      
      // Notify listeners of the change
      this.notifyListeners();

      // If server sync callback is provided, sync with server
      if (onUserNameUpdate) {
        try {
          await onUserNameUpdate(newName);
          console.log('User name synced with server successfully');
        } catch (serverError) {
          console.error('Error syncing user name with server:', serverError);
          // Don't throw error here to keep local update successful
          // The server sync failure shouldn't prevent local update
        }
      }
    } catch (error) {
      console.error('Error updating user name:', error);
      throw error;
    }
  }

  /**
   * Check if user has set a custom profile photo
   * Uses in-memory currentUser data for performance (synchronous)
   */
  hasCustomPhoto(): boolean {
    return (
      this.currentUser?.photo !== null &&
      this.currentUser?.photo !== undefined &&
      this.currentUser?.photo !== ''
    );
  }

  /**
   * Clear the current user (called when user logs out)
   * This clears the active session from memory and removes session token
   */
  async clearCurrentUser(): Promise<void> {
    this.currentUser = null;
    
    // Clear session token from storage to end the session
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error clearing user token during logout:', error);
    }
    
    // Notify listeners of the change
    this.notifyListeners();
  }

  /**
   * Check if user is logged in
   */
  isUserLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.email !== null;
  }
}

export const userManager = UserManager.getInstance(); 