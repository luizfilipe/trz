import { connect } from 'mongoose'

export class Database {
  constructor() {
    this.connect()
  }

  connect() {
    return connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).then(() => console.log('Database connected'))
      .catch(console.error)
  }
}


