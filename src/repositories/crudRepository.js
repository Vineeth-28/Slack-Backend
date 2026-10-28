export default function crudRepository(schema) {
  return {
    model: schema,
    create: async (data) => {
      const newDoc = await this.model.create(data)
      return newDoc
    },
    getAll: async () => {
      const allDocs = await this.model.find()
      return allDocs
    },
    getById: async (id) => {
      const doc = await this.model.findById(id)
      return doc
    },
    delete: async (id) => {
      const response = await this.model.findByIdAndDelete(id)
      return response
    },
    update: async (id, data) => {
      const updatedDoc = await this.model.findByIdAndUpdate(id, data, {
        new: true
      })
      return updatedDoc
    }
  }
}
