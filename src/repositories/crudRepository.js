export default function crudRepository(schema) {
  return {
    // Keep this here in case other parts of your app look for it
    model: schema, 

    // FIXED: Removed 'this.model' and used 'schema' directly
    create: async (data) => {
      const newDoc = await schema.create(data);
      return newDoc;
    },
    
    getAll: async () => {
      const allDocs = await schema.find();
      return allDocs;
    },
    
    getById: async (id) => {
      const doc = await schema.findById(id);
      return doc;
    },
    
    delete: async (id) => {
      const response = await schema.findByIdAndDelete(id);
      return response;
    },
    
    update: async (id, data) => {
      const updatedDoc = await schema.findByIdAndUpdate(id, data, {
        new: true
      });
      return updatedDoc;
    }
  };
}
