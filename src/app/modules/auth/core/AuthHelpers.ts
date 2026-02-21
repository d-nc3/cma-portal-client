import { AuthModel } from './_models';
import { setCookie, getCookie, removeCookie } from '../../util/cookieHelper';

const AUTH_COOKIE_KEY = 'kt-auth-react-v';
const isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';

const normalizeAuth = (auth?: Partial<AuthModel>): AuthModel | undefined => {
  if (!auth) return undefined;
  const resolvedToken = auth.api_token || auth.token;
  return {
    ...(auth as AuthModel),
    api_token: resolvedToken || '',
    token: resolvedToken,
  };
};

const getAuth = (): AuthModel | undefined => {
  const cookieValue = getCookie(AUTH_COOKIE_KEY);
  
  if (!cookieValue) {
    return;
  }

  try {
    const auth = normalizeAuth(JSON.parse(cookieValue) as Partial<AuthModel>);
    if (auth) return auth;
  
  } catch (error) {
    console.error('AUTH COOKIE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel) => {
  try {
    const normalizedAuth = normalizeAuth(auth);
    if (!normalizedAuth) return;

    const cookieValue = JSON.stringify(normalizedAuth);
    setCookie(AUTH_COOKIE_KEY, cookieValue, {
      expires: 7, 
      secure: isSecureContext,
      sameSite: 'strict',
      path: '/'
    });
  } catch (error) {
    console.error('AUTH COOKIE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  try {
    removeCookie(AUTH_COOKIE_KEY, { path: '/' });
  } catch (error) {
    console.error('AUTH COOKIE REMOVE ERROR', error);
  }
};

const getAuthToken = (): string | undefined => {
  const auth = getAuth();
  return auth?.api_token || auth?.token;
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers?: { Authorization?: string } }) => {
      config.headers = config.headers ?? {};
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (err: any) => Promise.reject(err)
  );
}

export { getAuth, getAuthToken, setAuth, removeAuth, AUTH_COOKIE_KEY };
