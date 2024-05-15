import addressService from "../services/address-service.js";

const create = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await addressService.create(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id } = await req.query;
    if (id) {
      req.body.id = await id;
      req.body.user_id = await req.id;
      const result = await addressService.getById(req.body);
      res.status(200).json(result).end();
    } else {
      req.body.user_id = await req.id;
      const result = await addressService.get(req.body);
      res.status(200).json(result).end();
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await addressService.updates(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await addressService.deletes(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export default { create, get, update, deletes };
