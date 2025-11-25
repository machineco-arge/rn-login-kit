import {Platform} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import {IUserInfo, SocialAuthConfig} from '../types';
import {userManager} from '../managers/UserManager';

export class SocialAuthService {
  private config: SocialAuthConfig;
  private apiBaseUrl?: string;
  private endpoints?: {googleLogin: string; appleLogin: string; logout: string};
  private onGetUserName?: () => Promise<string | null>;

  constructor(
    config: SocialAuthConfig,
    apiConfig?: {
      baseUrl: string;
      endpoints: {googleLogin: string; appleLogin: string; logout: string};
    },
    onGetUserName?: () => Promise<string | null>,
  ) {
    this.config = config;
    this.apiBaseUrl = apiConfig?.baseUrl;
    this.endpoints = apiConfig?.endpoints;
    this.onGetUserName = onGetUserName;
    this.initializeGoogle();
  }

  private initializeGoogle(): void {
    if (!this.config.google?.enabled) return;

    GoogleSignin.configure({
      webClientId: this.config.google.webClientId,
      iosClientId: this.config.google.iosClientId,
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
  }

  async signInWithGoogle(): Promise<{
    success: boolean;
    user?: IUserInfo;
    error?: string;
  }> {
    if (!this.config.google?.enabled) {
      return {success: false, error: 'Google authentication is not enabled'};
    }

    if (!this.apiBaseUrl && !this.endpoints?.googleLogin) {
      return {success: false, error: 'Google authentication is not enabled'};
    }

    try {
      await this.checkPlayServices();

      const signInResult = await GoogleSignin.signIn();

      if (!signInResult?.data?.idToken) {
        const tokens = await GoogleSignin.getTokens();
        if (!tokens.idToken) {
          throw new Error('No ID token found');
        }
      }

      if (!signInResult.data) {
        throw new Error('Sign-in data is missing');
      }

      // Save to backend if configured

      const response =  await this.authenticateWithBackend('google', {
        token: signInResult.data.idToken || '',
        accessToken: (await GoogleSignin.getTokens()).accessToken,
        email: signInResult.data.user.email || '',
        name:
          signInResult.data.user.givenName || signInResult.data.user.name || '',
        photo: signInResult.data.user.photo,
        serverAuthCode: signInResult.data.serverAuthCode,
        providerId: 'google.com',
      });
      
      const user: IUserInfo = {
        idToken: response.data.userToken || '',
        name:
          signInResult.data.user.givenName || signInResult.data.user.name || '',
        email: signInResult.data.user.email || '',
        photo: signInResult.data.user.photo,
        providerId: 'google.com',
      };

      // Save user session
      await this.saveUserSession(user, this.onGetUserName);

      return {success: true, user};
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (
        error?.code === statusCodes.SIGN_IN_CANCELLED ||
        (Platform.OS === 'ios' && error?.message?.includes('cancel'))
      ) {
        return {success: false, error: 'User cancelled sign-in'};
      }

      return {success: false, error: error?.message || 'Google sign-in failed'};
    }
  }

  async signInWithApple(): Promise<{
    success: boolean;
    user?: IUserInfo;
    error?: string;
  }> {
    if (!this.config.apple?.enabled || Platform.OS !== 'ios') {
      return {success: false, error: 'Apple authentication is not available'};
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error('Apple Sign-In failed - not authorized');
      }

      const {identityToken, email, fullName} = appleAuthRequestResponse;
      console.log('ID Token:', identityToken);

      if (!identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const user: IUserInfo = {
        idToken: identityToken,
        name: fullName?.givenName || 'Apple User',
        email: email || 'No Email Provided',
        photo: null,
        providerId: 'apple.com',
      };

      // Save to backend if configured
      if (this.apiBaseUrl && this.endpoints?.appleLogin) {
        await this.authenticateWithBackend('apple', {
          identityToken,
          email,
          fullName: fullName
            ? {
                firstName: fullName.givenName,
                lastName: fullName.familyName,
              }
            : undefined,
          appleUserId: appleAuthRequestResponse.user,
          providerId: 'apple.com',
        });
      }

      // Save user session
      await this.saveUserSession(user, this.onGetUserName);

      return {success: true, user};
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      return {success: false, error: error?.message || 'Apple sign-in failed'};
    }
  }

  /**
   * Google logout method - handles complete Google sign out process
   * @returns Promise<boolean> indicating logout success
   */
  async useGoogleAuthOut(): Promise<boolean> {
    if (!this.config.google?.enabled) {
      return false;
    }

    try {
      const userToken = userManager.getCurrentUser()?.idToken;
      if (!userToken) {
        return true; // No active session found
      }

      // Backend logout request
      await this.backendLogout(userToken);

      // Clear local Google authentication
      await this.clearGoogleAuthentication();

      return true;
    } catch (error) {
      console.error('Google logout error:', error);
      // If backend is unreachable, still try to clear local auth
      try {
        await this.clearGoogleAuthentication();
        return true;
      } catch (clearError) {
        console.error('Error clearing Google authentication:', clearError);
        return false;
      }
    }
  }

  /**
   * Apple logout/revoke method - handles Apple sign in revocation
   * @returns Promise<boolean> indicating revocation success
   */
  async revokeAppleSignIn(): Promise<boolean> {
    if (!this.config.apple?.enabled || Platform.OS !== 'ios') {
      return false;
    }

    try {
      // Request revocation authorization code from Apple
      const {authorizationCode} = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.REFRESH,
      });

      if (!authorizationCode) {
        throw new Error(
          'Apple revocation failed - no authorization code returned',
        );
      }

      // Send revocation request to backend with logout endpoint
      if (this.apiBaseUrl && this.endpoints?.logout) {
        await axios.post(`${this.apiBaseUrl}${this.endpoints.logout}`, {
          authorizationCode,
          provider: 'apple',
        });
      }

      // Clear local Apple authentication
      await this.clearAppleAuthentication();

      return true;
    } catch (error) {
      console.error('Apple revocation error:', error);
      // Even if backend fails, try to clear local auth
      try {
        await this.clearAppleAuthentication();
        return true;
      } catch (clearError) {
        console.error('Error clearing Apple authentication:', clearError);
        return false;
      }
    }
  }

  /**
   * Perform backend logout request using logout endpoint
   */
  private async backendLogout(userToken: string): Promise<void> {
    if (!this.apiBaseUrl || !this.endpoints?.logout) {
      return;
    }

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}${this.endpoints.logout}`,
        {
          userToken,
          provider: 'google',
        },
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Backend logout failed');
      }
    } catch (error) {
      console.error('Backend logout failed:', error);
      throw error;
    }
  }

  /**
   * Clear Google local authentication data
   */
  private async clearGoogleAuthentication(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await userManager.clearCurrentUser();
    } catch (error) {
      console.error('Error clearing Google authentication:', error);
      throw error;
    }
  }

  /**
   * Clear Apple local authentication data
   */
  private async clearAppleAuthentication(): Promise<void> {
    try {
      await userManager.clearCurrentUser();
    } catch (error) {
      console.error('Error clearing Apple authentication:', error);
      throw error;
    }
  }

  private async checkPlayServices(): Promise<void> {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
  }

  private async authenticateWithBackend(
    provider: 'google' | 'apple',
    data: any,
  ): Promise<any> {
    if (!this.apiBaseUrl || !this.endpoints) return;

    const endpoint =
      provider === 'google'
        ? this.endpoints.googleLogin
        : this.endpoints.appleLogin;
    const url = `${this.apiBaseUrl}${endpoint}`;

    const response = await axios.post(url, data);
    return response
  }

  private async saveUserSession(user: IUserInfo, onGetUserName?: () => Promise<string | null>): Promise<void> {
    if (!user.idToken) {
      throw new Error('idToken is null! Cannot save user session.');
    }

    await userManager.setCurrentUser(user, onGetUserName);
  }
}
