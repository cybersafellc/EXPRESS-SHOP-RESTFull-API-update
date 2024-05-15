import productService from "../services/product-service.js";

const imageUpload = async (req, res, next) => {
  try {
    const result = await productService.imageUpload(req.file);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await productService.create(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id, search } = await req.query;
    if (id) {
      const result = await productService.getById(id);
      res.status(200).json(result).end();
    } else if (search) {
      const result = await productService.getByQuery(search);
      res.status(200).json(result).end();
    } else {
      const result = await productService.getAll();
      res.status(200).json(result).end();
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await productService.update(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    const result = await productService.deletes(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export default { imageUpload, create, get, update, deletes };
