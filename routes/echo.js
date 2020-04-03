export default [
  {
    method: 'GET',
    path: '/echo',
    async handler (request) {
      return request.query
    }
  }
]
