import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  baseUrl = 'http://localhost:4200';
  clientId = '0i04pj317onf17lg40qgqe9t1h8gxt';
  redirect() {
    const hideText = 'text-to-hide-access-token-';
    location.href = `https://id.twitch.tv/oauth2/authorize?response_type=token+id_token&client_id=${
      this.clientId
    }&redirect_uri=${this.baseUrl}/${hideText.repeat(
      10
    )}&scope=chat%3Aread+chat%3Aedit+openid`;
  }

  addToken(params: URLSearchParams) {
    localStorage.setItem('token', params.get('access_token') ?? '');
    localStorage.setItem(
      'channel_name',
      this.parseJwt(params.get('id_token') ?? '')['preferred_username']
    );
    window.location.href = this.baseUrl;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getChannelName() {
    return localStorage.getItem('channel_name') ?? '';
  }

  genHexString(len: number) {
    const hex = '0123456789ABCDEF';
    let output = '';
    for (let i = 0; i < len; ++i) {
      output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }

  //yoink
  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('channel_name');
    location.reload();
  }
}
