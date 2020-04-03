import { omit } from 'lodash'

export const response = (h, r, e = []) => {
  const data = r?.toJSON ? r.toJSON() : r
  const forbidden = ['infected', 'reports']
  if (data) {
    const {infected} = data
    if (infected) {
      forbidden.push('inventory')
    }
  }

  return h.response(omit(data, [...e, '__v', ...forbidden]))
}
