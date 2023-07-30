import APIRepository from '../classes/APIRepository'
import { apiV2 } from 'src/boot/axios'
import { StudyPlan, StudyPlanList } from 'src/models/StudyPlan'
import { WebsiteSetting } from 'src/models/WebsiteSetting'

export default class StudyPlanAPI extends APIRepository {
  constructor() {
    super('studyPlan', apiV2, '/plan', new StudyPlan())
    this.APIAdresses = {
      plan: '/plan',
      studyEvent: (id) => '/studyEvent/' + id + '/studyPlans',
      getPlans: (id) => '/studyPlan/' + id + '/plans',
      planOptions: '/abrisham/selectPlan/create',
      myStudyPlan: '/abrisham/myStudyPlan',
      studyPlan: '/studyPlan',
      setting: 'website-setting/user'
    }
    this.CacheList = {
      studyEvent: (id) => this.name + this.APIAdresses.studyEvent(id),
      getPlans: (id) => this.name + this.APIAdresses.getPlans(id),
      studyPlan: this.name + this.APIAdresses.studyPlan
    }
  }

  getStudyEvents(id, cache = { TTL: 1000 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.studyEvent(id),
      ...(cache && { cache }),
      resolveCallback: (response) => {
        return new StudyPlanList(response.data.data)
      },
      rejectCallback: () => {
        return new StudyPlanList()
      }
    })
  }

  getPlans(id, cache = { TTL: 1000 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.getPlans(id),
      ...(cache && { cache }),
      resolveCallback: (response) => {
        return new StudyPlanList(response.data.data)
      },
      rejectCallback: () => {
        return new StudyPlanList()
      }
    })
  }

  getChangePlanOptions() {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.planOptions,
      resolveCallback: (response) => {
        return {
          grades: response.data.data.grades ? response.data.data.grades : [],
          majors: response.data.data.majors ? response.data.data.majors : [],
          studyPlans: response.data.data.studyPlans ? response.data.data.studyPlans : [],
          products: response.data.data.products ? response.data.data.products : []
        }
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  getMyStudyPlan() {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.myStudyPlan,
      resolveCallback: (response) => {
        return {
          id: response.data.data?.id,
          title: response.data.data?.title,
          passed_days: response.data.data?.passed_days,
          count_of_watched_sessions: response.data.data?.count_of_watched_sessions,
          count_of_remained_sessions: response.data.data?.count_of_remained_sessions
        }
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  updateMyStudyPlan(data = {}) {
    return this.sendRequest({
      apiMethod: 'post',
      api: this.api,
      request: this.APIAdresses.myStudyPlan,
      data: this.getNormalizedSendData({
        study_method_id: null, // Number
        major_id: null, // Number
        grade_id: null // Number
      }, data),
      resolveCallback: (response) => {
        return new StudyPlan(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  getStudyPlanData(data = {}, cache = { TTL: 100 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.studyPlan,
      ...(cache && { cache }),
      data: this.getNormalizedSendData({
        study_event: null,
        since_date: '',
        till_date: ''
      }, data),
      resolveCallback: (response) => {
        return new StudyPlanList(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  storeSetting(data = {}) {
    return this.sendRequest({
      apiMethod: 'post',
      api: this.api,
      request: this.APIAdresses.setting,
      data: this.getNormalizedSendData({
        setting: {}
      }, data),
      resolveCallback: (response) => {
        return response.message ? response.message : null
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  getSetting(cache = { TTL: 100 }) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.setting,
      ...(cache && { cache }),
      resolveCallback: (response) => {
        return new WebsiteSetting(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }
}
