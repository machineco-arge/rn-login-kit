import axios from 'axios';
import { userManager } from '../managers/UserManager';
import { EmailAuthConfig, IUserInfo, LoginKitConfig } from '../types';

interface ApiConfig {
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
  private apiConfig?: ApiConfig;
  private emailAuthConfig?: EmailAuthConfig;
  private onGetUserName?: () => Promise<string | null>;

  constructor(config: LoginKitConfig) {
    this.apiConfig = config.apiConfig;
    this.emailAuthConfig = config.emailAuth;
    this.onGetUserName = config.navigation.onGetUserName;
  }

  async signInWithEmail(_companyName: string, _email: string, _userName: string, password: string): Promise<EmailAuthResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.userLogin) {
      throw new Error('Email authentication not configured');
    }

    try {
      const requestData: { email?: string; password: string; companyName?: string; userName?: string } = {
        password: password,
      };

      if (this.emailAuthConfig?.enabledSignInCompanyName) {
        requestData.companyName = _companyName;
      }

      if (this.emailAuthConfig?.enabledSignInEmail) {
        requestData.email = _email;
      }

      if (this.emailAuthConfig?.enabledSignInUserName) {
        requestData.userName = _userName;
      }


      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.userLogin,
        requestData,
      );

      const name = this.emailAuthConfig?.enabledSignInUserName ? _userName : this.emailAuthConfig?.enabledSignInCompanyName ? _companyName : _email.split('@')[0] || 'User';
      const nameMail = `${name}@example.com`
      if (response.status === 200) {
        const userInfo: IUserInfo = {
          idToken: response.data.userToken,
          name: name,
          email: this.emailAuthConfig?.enabledSignInEmail ? _email : nameMail || 'No Email Provided',
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

  async registerWithEmail(_userName: string, _email: string, password: string): Promise<EmailAuthResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.userRegister) {
      throw new Error('Email registration not configured');
    }

    try {
      const requestData: { email?: string; password: string; userName?: string } = {
        password: password,
      };

      if (this.emailAuthConfig?.enabledRegisterEmail) {
        requestData.email = _email;
      }

      if (this.emailAuthConfig?.enabledRegisterUserName) {
        requestData.userName = _userName;
      }

      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.userRegister,
        requestData
      );

      const companyName = 'tempName'
      if (response.status === 200) {
        // Registration successful, now automatically login to get the JWT token
        const loginResult = await this.signInWithEmail(companyName, _email, _userName, password);
        
        if (loginResult.success && loginResult.user) {
          // Update the user name from registration
          if (_userName && loginResult.user.name !== _userName) {
            loginResult.user.name = _userName;
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