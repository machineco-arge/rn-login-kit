import axios from 'axios';
import { userManager } from '../managers/UserManager';
import { EmailAuthConfig, IUserInfo, LoginKitConfig } from '../types';
import { extractAuthApiError } from '../utils/authApiErrors';

interface ApiConfig {
  baseUrl: string;
  endpoints: {
    googleLogin: string;
    appleLogin: string;
    userLogin?: string;
    userRegister?: string;
    sendRegistrationCode?: string;
    sendPasswordResetCode?: string;
    verifyPasswordResetCode?: string;
    resetPassword?: string;
  };
}

interface EmailAuthResult {
  success: boolean;
  user?: IUserInfo;
  error?: string;
  errorCode?: string;
}

interface SimpleResult {
  success: boolean;
  error?: string;
  errorCode?: string;
}

interface VerifyPasswordResetResult {
  success: boolean;
  passwordResetToken?: string;
  error?: string;
  errorCode?: string;
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

  async sendRegistrationCode(_email: string): Promise<SimpleResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.sendRegistrationCode) {
      throw new Error('Registration code endpoint not configured');
    }

    try {
      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.sendRegistrationCode,
        { email: _email },
      );

      if (response.status === 200) {
        return { success: true };
      }
      const data = response.data;
      return {
        success: false,
        error: data?.message || 'Failed to send verification code',
        errorCode: data?.code,
      };
    } catch (error: unknown) {
      const apiError = extractAuthApiError(error);
      return {
        success: false,
        error: apiError.message || (error instanceof Error ? error.message : 'Failed to send verification code'),
        errorCode: apiError.code,
      };
    }
  }

  async registerWithEmail(
    _userName: string,
    _email: string,
    password: string,
    verificationCode: string,
  ): Promise<EmailAuthResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.userRegister) {
      throw new Error('Email registration not configured');
    }

    try {
      const requestData: {
        email?: string;
        password: string;
        userName?: string;
        verificationCode: string;
      } = {
        password: password,
        verificationCode: verificationCode,
      };

      if (this.emailAuthConfig?.enabledRegisterEmail) {
        requestData.email = _email;
      }

      if (this.emailAuthConfig?.enabledRegisterUserName) {
        requestData.userName = _userName;
      }

      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.userRegister,
        requestData,
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
    } catch (error: unknown) {
      const apiError = extractAuthApiError(error);
      return {
        success: false,
        error: apiError.message || (error instanceof Error ? error.message : 'Registration failed'),
        errorCode: apiError.code,
      };
    }
  }

  async sendPasswordResetCode(_email: string): Promise<SimpleResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.sendPasswordResetCode) {
      throw new Error('Password reset code endpoint not configured');
    }

    try {
      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.sendPasswordResetCode,
        { email: _email },
      );

      if (response.status === 200) {
        return { success: true };
      }
      const data = response.data;
      return {
        success: false,
        error: data?.message || 'Failed to send reset code',
        errorCode: data?.code,
      };
    } catch (error: unknown) {
      const apiError = extractAuthApiError(error);
      return {
        success: false,
        error: apiError.message || (error instanceof Error ? error.message : 'Failed to send reset code'),
        errorCode: apiError.code,
      };
    }
  }

  async verifyPasswordResetCode(_email: string, verificationCode: string): Promise<VerifyPasswordResetResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.verifyPasswordResetCode) {
      throw new Error('Password reset verify endpoint not configured');
    }

    try {
      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.verifyPasswordResetCode,
        { email: _email, verificationCode },
      );

      if (response.status === 200 && response.data?.passwordResetToken) {
        return {
          success: true,
          passwordResetToken: response.data.passwordResetToken,
        };
      }

      const data = response.data;
      return {
        success: false,
        error: data?.message || 'Verification failed',
        errorCode: data?.code,
      };
    } catch (error: unknown) {
      const apiError = extractAuthApiError(error);
      return {
        success: false,
        error: apiError.message || (error instanceof Error ? error.message : 'Verification failed'),
        errorCode: apiError.code,
      };
    }
  }

  async resetPassword(
    _email: string,
    passwordResetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<SimpleResult> {
    if (!this.apiConfig?.baseUrl || !this.apiConfig?.endpoints?.resetPassword) {
      throw new Error('Password reset endpoint not configured');
    }

    try {
      const response = await axios.post(
        this.apiConfig.baseUrl + this.apiConfig.endpoints.resetPassword,
        {
          email: _email,
          passwordResetToken,
          newPassword,
          confirmPassword,
        },
      );

      if (response.status === 200) {
        return { success: true };
      }
      const data = response.data;
      return {
        success: false,
        error: data?.message || 'Password reset failed',
        errorCode: data?.code,
      };
    } catch (error: unknown) {
      const apiError = extractAuthApiError(error);
      return {
        success: false,
        error: apiError.message || (error instanceof Error ? error.message : 'Password reset failed'),
        errorCode: apiError.code,
      };
    }
  }

  async resetPasswordAndSignIn(
    _userName: string,
    _email: string,
    passwordResetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<EmailAuthResult> {
    const resetResult = await this.resetPassword(_email, passwordResetToken, newPassword, confirmPassword);
    if (!resetResult.success) {
      return { success: false, error: resetResult.error, errorCode: resetResult.errorCode };
    }

    const companyName = 'tempName'
    return this.signInWithEmail(companyName, _email, _userName, newPassword);
  }
}
