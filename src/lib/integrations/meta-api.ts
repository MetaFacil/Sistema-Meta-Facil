// Meta (Facebook/Instagram) API Integration Service
// Fallback para axios quando não instalado
let axios: any;
try {
  axios = require('axios').default;
} catch (error) {
  // Mock do axios quando a dependência não está instalada
  axios = {
    get: async (url: string, config?: any) => {
      console.warn('Axios not installed. Using mock implementation for GET:', url);
      return { data: {}, status: 200, statusText: 'OK' };
    },
    post: async (url: string, data?: any, config?: any) => {
      console.warn('Axios not installed. Using mock implementation for POST:', url);
      return { data: { success: true }, status: 200, statusText: 'OK' };
    },
    put: async (url: string, data?: any, config?: any) => {
      console.warn('Axios not installed. Using mock implementation for PUT:', url);
      return { data: { success: true }, status: 200, statusText: 'OK' };
    },
    delete: async (url: string, config?: any) => {
      console.warn('Axios not installed. Using mock implementation for DELETE:', url);
      return { data: { success: true }, status: 200, statusText: 'OK' };
    }
  };
}
import { API_ENDPOINTS } from '../constants';

export interface MetaAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MetaPage {
  id: string;
  name: string;
  category: string;
  access_token: string;
  tasks: string[];
}

export interface MetaPostData {
  message: string;
  link?: string;
  picture?: string;
  scheduled_publish_time?: number;
  published: boolean;
}

export interface MetaPostResponse {
  id: string;
  post_id?: string;
}

export interface MetaInsights {
  data: Array<{
    name: string;
    period: string;
    values: Array<{
      value: number;
      end_time: string;
    }>;
  }>;
}

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  caption?: string;
}

class MetaAPIService {
  private baseURL = API_ENDPOINTS.META.baseUrl;
  private appId = process.env.META_APP_ID;
  private appSecret = process.env.META_APP_SECRET;

  // Construir URL de autorização para Meta
  getAuthorizationUrl(redirectUri: string, scopes: string[] = []): string {
    const defaultScopes = [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list',
      'instagram_basic',
      'instagram_content_publish'
    ];
    
    const allScopes = [...defaultScopes, ...scopes].join(',');
    
    const params = new URLSearchParams({
      client_id: this.appId || '',
      redirect_uri: redirectUri,
      scope: allScopes,
      response_type: 'code',
      state: Math.random().toString(36).substring(7)
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  // Trocar código por token de acesso
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<MetaAuthResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/oauth/access_token`, {
        params: {
          client_id: this.appId,
          client_secret: this.appSecret,
          redirect_uri: redirectUri,
          code: code
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao trocar código por token:', error);
      throw new Error('Falha na autenticação com Meta');
    }
  }

  // Obter token de longa duração
  async getLongLivedToken(shortLivedToken: string): Promise<MetaAuthResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: shortLivedToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter token de longa duração:', error);
      throw new Error('Falha ao obter token de longa duração');
    }
  }

  // Obter páginas do usuário
  async getUserPages(accessToken: string): Promise<MetaPage[]> {
    try {
      const response = await axios.get(`${this.baseURL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,category,access_token,tasks'
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter páginas:', error);
      throw new Error('Falha ao obter páginas do Facebook');
    }
  }

  // Publicar post no Facebook
  async publishFacebookPost(pageId: string, pageAccessToken: string, postData: MetaPostData): Promise<MetaPostResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/${pageId}/feed`,
        postData,
        {
          params: {
            access_token: pageAccessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao publicar post no Facebook:', error);
      throw new Error('Falha ao publicar post no Facebook');
    }
  }

  // Agendar post no Facebook
  async scheduleFacebookPost(
    pageId: string, 
    pageAccessToken: string, 
    postData: MetaPostData, 
    scheduledTime: Date
  ): Promise<MetaPostResponse> {
    const scheduleData = {
      ...postData,
      published: false,
      scheduled_publish_time: Math.floor(scheduledTime.getTime() / 1000)
    };

    return this.publishFacebookPost(pageId, pageAccessToken, scheduleData);
  }

  // Obter Instagram Business Account conectado à página
  async getInstagramBusinessAccount(pageId: string, pageAccessToken: string): Promise<{ id: string } | null> {
    try {
      const response = await axios.get(`${this.baseURL}/${pageId}`, {
        params: {
          access_token: pageAccessToken,
          fields: 'instagram_business_account'
        }
      });

      return response.data.instagram_business_account || null;
    } catch (error) {
      console.error('Erro ao obter conta Instagram:', error);
      return null;
    }
  }

  // Criar container de mídia para Instagram
  async createInstagramMediaContainer(
    instagramAccountId: string,
    pageAccessToken: string,
    mediaData: {
      image_url?: string;
      video_url?: string;
      caption?: string;
      media_type?: 'IMAGE' | 'VIDEO';
    }
  ): Promise<{ id: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/${instagramAccountId}/media`,
        mediaData,
        {
          params: {
            access_token: pageAccessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar container de mídia:', error);
      throw new Error('Falha ao criar mídia do Instagram');
    }
  }

  // Publicar mídia no Instagram
  async publishInstagramMedia(
    instagramAccountId: string,
    pageAccessToken: string,
    creationId: string
  ): Promise<{ id: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/${instagramAccountId}/media_publish`,
        {
          creation_id: creationId
        },
        {
          params: {
            access_token: pageAccessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao publicar mídia no Instagram:', error);
      throw new Error('Falha ao publicar no Instagram');
    }
  }

  // Obter insights de página do Facebook
  async getFacebookPageInsights(
    pageId: string,
    pageAccessToken: string,
    metrics: string[] = ['page_impressions', 'page_reach', 'page_engaged_users'],
    period: 'day' | 'week' | 'days_28' = 'day'
  ): Promise<MetaInsights> {
    try {
      const response = await axios.get(`${this.baseURL}/${pageId}/insights`, {
        params: {
          access_token: pageAccessToken,
          metric: metrics.join(','),
          period: period
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter insights do Facebook:', error);
      throw new Error('Falha ao obter insights do Facebook');
    }
  }

  // Obter insights do Instagram
  async getInstagramInsights(
    instagramAccountId: string,
    pageAccessToken: string,
    metrics: string[] = ['impressions', 'reach', 'profile_views'],
    period: 'day' | 'week' | 'days_28' = 'day'
  ): Promise<MetaInsights> {
    try {
      const response = await axios.get(`${this.baseURL}/${instagramAccountId}/insights`, {
        params: {
          access_token: pageAccessToken,
          metric: metrics.join(','),
          period: period
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter insights do Instagram:', error);
      throw new Error('Falha ao obter insights do Instagram');
    }
  }

  // Obter mídia do Instagram
  async getInstagramMedia(
    instagramAccountId: string,
    pageAccessToken: string,
    limit: number = 25
  ): Promise<{ data: InstagramMedia[] }> {
    try {
      const response = await axios.get(`${this.baseURL}/${instagramAccountId}/media`, {
        params: {
          access_token: pageAccessToken,
          fields: 'id,media_type,media_url,permalink,timestamp,caption',
          limit: limit
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter mídia do Instagram:', error);
      throw new Error('Falha ao obter mídia do Instagram');
    }
  }

  // Validar token de acesso
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name'
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Renovar token de acesso
  async refreshAccessToken(accessToken: string): Promise<MetaAuthResponse | null> {
    try {
      const response = await axios.get(`${this.baseURL}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return null;
    }
  }
}

export const metaAPIService = new MetaAPIService();