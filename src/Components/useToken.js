import { useState } from 'react';
import {
  isTokenExpired,
  publishSharedToken,
  readSharedToken,
  clearSharedToken,
} from './sharedToken';

export default function useToken() {
  const getToken = () => {
    const shared = readSharedToken();

    // Pick up a token published by user-auth-react on localhost:3001.
    if (shared && !isTokenExpired(shared)) {
      localStorage.setItem('token', shared);
      return shared;
    }

    // No shared session (e.g. the other app logged out): drop the stale local token.
    const local = localStorage.getItem('token');
    if (local) {
      localStorage.removeItem('token');
      clearSharedToken();
    }

    return null;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    const newToken = userToken ?? null;

    if (newToken === null) {
      localStorage.removeItem('token');
      clearSharedToken();
    } else {
      localStorage.setItem('token', newToken);
      publishSharedToken(newToken);
    }

    setToken(newToken);
  };

  return {
    setToken: saveToken,
    token
  }
}
