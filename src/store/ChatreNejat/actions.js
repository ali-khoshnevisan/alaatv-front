import { APIGateway } from 'src/api/APIGateway.js'

const actions = {
  showConfirmDialog: (context, newInfo) => {
    context.commit('AppLayout/showConfirmDialog', newInfo)
  },
  getSet: (context, productId) => {
    APIGateway.product.getSets(productId)
      .then((setList) => {
        const normalizedSets = setList.list.map(set => {
          if (set.short_title !== null) {
            const splitted = set.short_title.split('-')
            const productName = splitted[0] ? splitted[0] : 'متفرقه'
            const topicName = splitted[1] ? splitted[1] : 'متفرقه'
            const setName = splitted[2] ? splitted[2] : 'متفرقه'
            set.short_title = productName + '-' + topicName + '-' + setName

            return set
          } else {
            set.short_title = 'عنوان ندارد'
            return set
          }
        })
        const topicList = normalizedSets.map(set => {
          const splitted = set.short_title.split('-')
          const topicName = splitted[1] ? splitted[1] : 'متفرقه'
          return topicName
        })
          .filter((topic, topicIndex, topics) => topics.findIndex(topicItem => topicItem === topic) === topicIndex)
        context.commit('updateSetList', normalizedSets)
        context.commit('updateTopicList', topicList)
      })
  }
}

export default actions
