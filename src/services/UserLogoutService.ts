import axios, {AxiosResponse} from 'axios';

/**
 * Interface for logout response from backend
 */
interface ILogoutResponse {
  success: boolean;
  message?: string;
}

export class UserLogoutService {
  private apiBaseUrl?: string;
  private logoutEndpoint?: string;

  constructor(apiBaseUrl?: string, logoutEndpoint?: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.logoutEndpoint = logoutEndpoint;
  }

  /**
   * Perform user logout request to backend
   * @param userToken - User token to logout
   * @returns Promise<void>
   */
  async logout(userToken: string): Promise<void> {
    if (!this.apiBaseUrl || !this.logoutEndpoint) {
      throw new Error('API configuration not provided');
    }

    try {
      const response: AxiosResponse<ILogoutResponse> = await axios.post(
        `${this.apiBaseUrl}${this.logoutEndpoint}`,
        {userToken},
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || 'Backend logout failed',
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Backend logout failed:', error.message);
        throw error;
      }
      throw new Error('Unknown error during backend logout');
    }
  }
} 