import Joi from '@hapi/joi'
import {
  createSurvivor,
  getAllNotInfected,
  getSurvivor, reportSurvivorAsInfected, trade,
  updateSurvivorLocation
} from '../controllers/survivor'
import { response } from '../utils/response'
import { INVENTORY_ITEMS_NAMES } from '../constants/inventory-items'

const path = '/survivor'

export default [
  {
    method: 'GET',
    path,
    async handler (request, h) {
      return response(h, await getAllNotInfected()).code(200)
    }
  },
  {
    method: 'GET',
    path: `${path}/{id}`,
    async handler (request, h) {
      return response(h, await getSurvivor(request.params.id)).code(200)
    }
  }, {
    method: 'POST',
    path,
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          age: Joi.number().integer().required(),
          gender: Joi.any().allow('male', 'female').required(),
          inventory: Joi.array().items(Joi.string().valid(...INVENTORY_ITEMS_NAMES))
            .required(),
          lastLocation: Joi.object({
            long: Joi.number().required(),
            lat: Joi.number().required()
          }).required()
        }
      }
    },
    async handler (request, h) {
      return response(h, await createSurvivor(request.payload)).code(200)
    }
  }, {
    method: ['PATCH', 'PUT'],
    path: `${path}/{id}/location`,
    config: {
      validate: {
        payload: {
          location: Joi.object({
            long: Joi.number().precision(2).required(),
            lat: Joi.number().precision(2).required()
          }).required()
        }
      }
    },
    async handler (request, h) {
      const { params, payload } = request
      return response(h, await updateSurvivorLocation(params.id, payload.location)).code(200)
    }
  }, {
    method: ['PATCH', 'PUT'],
    path: `${path}/{id}/report`,
    async handler (request, h) {
      return response(h, await reportSurvivorAsInfected(request.params.id)).code(200)
    }
  }, {
    method: ['PATCH', 'PUT'],
    path: `${path}/trade`,
    config: {
      validate: {
        payload: {
          seller: Joi.object({
            id: Joi.string().required(),
            items: Joi.array().items(Joi.object({
              name: Joi.string().valid(...INVENTORY_ITEMS_NAMES).required(),
              amount: Joi.number().integer().required()
            })).required()
          }),
          buyer: Joi.object({
            id: Joi.string().required(),
            items: Joi.array().items(Joi.object({
              name: Joi.string().valid(...INVENTORY_ITEMS_NAMES).required(),
              amount: Joi.number().integer().required()
            })).required()
          })
        }
      }
    },
    async handler (request, h) {
      return response(h, await trade(request.payload)).code(200)
    }
  }
]
