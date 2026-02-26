import { AuthModel } from './_models';
import { setCookie, getCookie, removeCookie } from '../../util/cookieHelper';

const AUTH_COOKIE_KEY = 'kt-auth-react-v';

const getAuth = (): AuthModel | undefined => {
  const cookieValue = getCookie(AUTH_COOKIE_KEY);
  
  if (!cookieValue) {
    return;
  }

  try {
    const auth: AuthModel = JSON.parse(cookieValue) as AuthModel;
    if (auth) return auth;
  
  } catch (error) {
    console.error('AUTH COOKIE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel) => {
  try {
    const cookieValue = JSON.stringify(auth);
    setCookie(AUTH_COOKIE_KEY, cookieValue, {
      expires: 7, 
      secure: true,
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

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();
      if (auth && auth.api_token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }

      return config;
    },
    (err: any) => Promise.reject(err)
  );
}

export { getAuth, setAuth, removeAuth, AUTH_COOKIE_KEY };