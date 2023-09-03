import APIRepository from '../classes/APIRepository'
import { apiV2 } from 'src/boot/axios'
import { BlockList } from 'src/models/Block'

export default class PagesAPI extends APIRepository {
  constructor() {
    super('pages', apiV2)
    this.APIAdresses = {
      home: '/home',
      shop: '/shop'
    }
    this.CacheList = {
      home: this.name + this.APIAdresses.home,
      shop: this.name + this.APIAdresses.shop
    }
  }

  home(cache = { TTL: 1000 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.home,
      cacheKey: this.CacheList.home,
      ...(cache && { cache }),
      resolveCallback: (response) => {
        console.warn('JSON.stringify(response.data)', JSON.stringify(response.data))
        if (response.data.data && response.data.data[9] && response.data.data[9].url) {
          console.warn('response.data.data[9].url', response.data.data[9].url)
        }
        return new BlockList(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  shop(cache = { TTL: 1000 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.shop,
      cacheKey: this.CacheList.shop,
      ...(cache && { cache }),
      resolveCallback: (response) => {
        return new BlockList(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }
}
