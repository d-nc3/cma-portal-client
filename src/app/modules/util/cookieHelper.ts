import Cookies from 'js-cookie';
import { CookieOptions } from '../../../types/utilTypes';

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  try {
    const defaultOptions: CookieOptions = {
      expires: 7, // 7 days
      path: '/',
      secure: true,
      sameSite: 'strict',
      ...options
    };

    Cookies.set(name, value, defaultOptions);
  } catch (error) {
    console.error('COOKIE SET ERROR', error);
  }
};

export const getCookie = (name: string): string | undefined => {
  try {
    return Cookies.get(name);
  } catch (error) {
    console.error('COOKIE GET ERROR', error);
    return undefined;
  }
};

export const removeCookie = (
  name: string,
  options?: Pick<CookieOptions, 'path' | 'domain'>
): void => {
  try {
    Cookies.remove(name, options);
  } catch (error) {
    console.error('COOKIE REMOVE ERROR', error);
  }
};