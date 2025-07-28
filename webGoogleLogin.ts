// utils/webGoogleLogin.ts

export const webGoogleLogin = () =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject('Not in browser');
  
      // Inject the Google Identity script if not already loaded
      if (!document.getElementById('google-login')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.id = 'google-login';
        script.onload = () => initializeGoogle(resolve, reject);
        document.head.appendChild(script);
      } else {
        initializeGoogle(resolve, reject);
      }
    });
  
  function initializeGoogle(resolve: any, reject: any) {
    if (!window.google || !window.google.accounts) return reject('Google not loaded');
  
    window.google.accounts.id.initialize({
      client_id: '657032691252-6d3uvir16pu0k46lvbv5u481qi02aafl.apps.googleusercontent.com',
      callback: (response: any) => {
        const credential = response.credential;
        const payload = parseJwt(credential);
        resolve(payload); // Contains user info
      },
    });
  
    window.google.accounts.id.prompt(); // Show One Tap login
  }
  
  function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  