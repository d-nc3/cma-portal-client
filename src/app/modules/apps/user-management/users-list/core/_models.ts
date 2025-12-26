import {ID, Response} from '../../../../../../_metronic/helpers'
export interface UserModel {
  id?: number
  username?: string
  password?: string | undefined
  email?: string
  first_name?: string
  last_name?: string
  fullname?: string
  occupation?: string
  companyName?: string
  phone?: string
  role?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: 'https://keenthemes.com'
}


