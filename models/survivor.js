import { Schema, model } from 'mongoose'

export const Survivor = model('survivor', new Schema({
  name: String,
  age: Number,
  gender: String,
  infected: Boolean,
  reports: Number,
  inventory: [String],
  lastLocation: {
    long: Number,
    lat: Number
  }
}))

Survivor.createCollection().then(() => console.log(`${Survivor.modelName} was loaded`))
