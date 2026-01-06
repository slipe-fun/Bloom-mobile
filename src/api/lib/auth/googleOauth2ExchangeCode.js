import { API_URL } from '@constants/api'
import axios from 'axios'

export default async function (code) {
  return await axios
    .get(`${API_URL}/oauth2/google/exchange-code`, {
      params: {
        state: 'random-state',
        code,
      },
    })
    .then((res) => res.data)
    .catch(() => null)
}
