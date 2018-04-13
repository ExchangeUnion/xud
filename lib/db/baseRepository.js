const baseRepository = exports;

baseRepository.find = async ({ model, payload }) => {
  const result = await model.create(payload);
  return result.id;
};

baseRepository.addOne = async (model, payload) => {
  const result = await model.create(payload);
  return result.id;
};

baseRepository.addMany = async (model, payload) => {
  const results = await model.bulkCreate(payload);
  return results.map(record => record.id);
};
