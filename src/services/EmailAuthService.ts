import axios from 'axios';
import { userManager } from '../managers/UserManager';
import { IUserInfo } from '../types';

interface EmailAuthConfig {
  baseUrl: string;
  endpoints: {
    googleLogin: string;
    appleLogin: string;
    userLogin?: string;
    userRegister?: string;
  };
}

interface EmailAuthResult {
  success: boolean;
  user?: IUserInfo;
  error?: string;
}

export class EmailAuthService {
  private apiConfig?: EmailAuthConfig;
  private onGetUserName?: () => Promise<string | null>;

  constructor(apiConfig?: EmailAuthConfig, onGetUserName?: () => Promise<string | null>) {
    this.apiConfig = apiConfig;
    this.onGetUserName = onGetUserName;
  }

  async signInWithEmail(email: string, password: string): Promise<EmailAuthResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.userLogin) {
      throw new Error('Email authentication not configured');
    }

    try {
      const requestData = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.userLogin,
        requestData
      );

      if (response.status === 200) {
        const userInfo: IUserInfo = {
          idToken: response.data.userToken,
          name: email.split('@')[0] || 'User',
          email: email || 'No Email Provided',
          photo: null,
          providerId: 'userSignIn',
        };

        if (!userInfo.idToken) {
          throw new Error('idToken is null! Cannot save userToken.');
        }

        await userManager.setCurrentUser(userInfo, this.onGetUserName);

        return {
          success: true,
          user: userInfo,
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  }

  async registerWithEmail(name: string, email: string, password: string): Promise<EmailAuthResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.userRegister) {
      throw new Error('Email registration not configured');
    }

    try {
      const requestData = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.userRegister,
        requestData
      );

      if (response.status === 200) {
        // Registration successful, now automatically login to get the JWT token
        const loginResult = await this.signInWithEmail(email, password);
        
        if (loginResult.success && loginResult.user) {
          // Update the user name from registration
          if (name && loginResult.user.name !== name) {
            loginResult.user.name = name;
            await userManager.setCurrentUser(loginResult.user, this.onGetUserName);
          }
          
          return {
            success: true,
            user: loginResult.user,
          };
        } else {
          return {
            success: false,
            error: 'Registration successful but automatic login failed. Please try logging in manually.',
          };
        }
      } else {
        return {
          success: false,
          error: response.data.message || 'Registration failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  }
} 