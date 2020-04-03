import { countBy } from 'lodash'
import { Survivor } from '../models/survivor'
import { INVENTORY_ITEMS } from '../constants/inventory-items'

export const createSurvivor = async survivor => await Survivor.create({
  ...survivor,
  infected: false,
  reports: 0
})

export const updateSurvivorLocation = async (id, lastLocation) => await Survivor
  .findByIdAndUpdate(id, { lastLocation }, { new: true })

export const reportSurvivorAsInfected = async id => {
  const survivor = await Survivor.findById(id)
  if (survivor.infected) {
    return survivor
  } else if (survivor.reports === 5) {
    survivor.infected = true
  } else {
    survivor.reports += 1
  }
  return await survivor.save()
}

export const getSurvivor = async id => await Survivor.findById(id)

export const getAllNotInfected = async () => await Survivor.find()
  .where('infected', false).lean().exec()

const checkAmount = (survivor, trader) => {
  const inventory = countBy(survivor.inventory)
  trader.items.forEach(item => {
    if (inventory[item.name] < item.amount) {
      throw new Error(`${survivor.name} doesn't have the amount to perform the trade`)
    }
  })
}

const canTrade = (seller, buyer) => {
  const reducer = (r, item) => r + (item.amount * INVENTORY_ITEMS[item.name])
  const buyerValue = buyer.items.reduce(reducer, 0)
  const sellerValue = seller.items.reduce(reducer, 0)
  if (buyerValue !== sellerValue) {
    throw new Error(`The proposed trade is not fair.`)
  }
}

const performTrade = async (model, from, to, session) => {
  model.inventory.pull(...from)
  model.inventory.push(...to)
  return model.save({ session })
}

export const trade = async trading => {
  const { seller, buyer } = trading
  canTrade(seller, buyer)
  const session = await Survivor.startSession()
  session.startTransaction()
  try {
    const sellerModel = await Survivor.findById(seller.id).session(session)
    const buyerModel = await Survivor.findById(buyer.id).session(session)
    checkAmount(sellerModel.toJSON(), seller)
    checkAmount(buyerModel.toJSON(), buyer)
    const reducer = (r, item) => [...r, ...Array.from({ length: item.amount }).map(_ => item.name)]
    const buyerItems = buyer.items.reduce(reducer, [])
    const sellerItems = seller.items.reduce(reducer, [])
    await performTrade(sellerModel, sellerItems, buyerItems, session)
    await performTrade(buyerModel, buyerItems, sellerItems, session)
    return session.commitTransaction()
  } catch (err) {
    session.abortTransaction()
    throw err
  }
}
