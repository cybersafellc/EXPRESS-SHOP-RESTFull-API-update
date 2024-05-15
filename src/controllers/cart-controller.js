import cartService from "../services/cart-service.js";

const create = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await cartService.create(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id } = await req.query;
    if (id) {
      req.body.user_id = await req.id;
      req.body.id = await id;
      const result = await cartService.getById(req.body);
      res.status(200).json(result).end();
    } else {
      req.body.user_id = await req.id;
      const result = await cartService.get(req.body);
      res.status(200).json(result).end();
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await cartService.update(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await cartService.deletes(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const deleteClear = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await cartService.deleteClear(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export default { create, get, update, deletes, deleteClear };
