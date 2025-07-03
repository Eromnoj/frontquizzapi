class RequestService {
  private static instance: RequestService;

  private constructor() {}

  public static getInstance(): RequestService {
    if (!RequestService.instance) {
      RequestService.instance = new RequestService();
    }
    return RequestService.instance;
  }

  private async csrf(): Promise<string> {
    const token = await fetch(`${import.meta.env.VITE_API_URL}/csrf`, {
      method: 'GET',
      credentials: 'include',
    });
    const csrfToken = await token.json();

    return csrfToken.token;
  }

  public async get(url: string) {
    const csrf = await this.csrf();
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
        },
        credentials: 'include', // Assurez-vous que les cookies sont envoyés avec la requête
      });
      if (!response.ok) {
        const errorData = await response.json();
        const res = {
          status: response.status,
          response: errorData
        }
        console.log("errorData", errorData);
        return res;
      }
      const responseData = await response.json();
      console.log("responseData", responseData);
      return responseData;
    } catch (error) {
      console.error('Error making GET request:', error);
      throw error;
    }
  }

  public async post(url: string, data: never) {
    const csrf = await this.csrf();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("errorData", errorData);
        const res = {
          status: response.status,
          response: errorData
        }
        return res;
      }
      const responseData = await response.json();
      const res = {
        status: response.status,
        response: responseData
      }
      return res;
    
  }

  public async put(url: string, data: never) {
    const csrf = await this.csrf();
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
        },
        credentials: 'include', // Assurez-vous que les cookies sont envoyés avec la requête
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const res = {
          status: response.status,
          response: errorData
        }
        return res;
      }
      const responseData = await response.json();
      const res = {
        status: response.status,
        response: responseData
      }
      return res;
    } catch (error) {
      console.error('Error making PUT request:', error);
      throw error;
    }
  }

  public async delete(url: string) {
    console.log("url", url);
    const csrf = await this.csrf();
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
        },
        credentials: 'include', // Assurez-vous que les cookies sont envoyés avec la requête
      });
      if (!response.ok) {
        const errorData = await response.json();
        const res = {
          status: response.status,
          response: errorData
        }
        return res;
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error making DELETE request:', error);
      throw error;
    }
  }
}

export default RequestService;