const baseRepository : any = {};

baseRepository.addOne = async (model, payload) => model.create(payload);

baseRepository.addMany = async (model, payload) => {
  const results = await model.bulkCreate(payload);
  return results.map(record => record.id);
};

export default baseRepository;
