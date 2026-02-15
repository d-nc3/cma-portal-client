import {ID, Response} from '../../../../../../_metronic/helpers'
export interface UserModel {
  id?: number
  username?: string
  password?: string | undefined
  email?: string
  first_name?: string
  status?: string | undefined
  last_name?: string
  name?: string
  occupation?: string
  companyName?: string
  phone?: string,
  fullname?: String,
  role?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: 'https://keenthemes.com'
}


