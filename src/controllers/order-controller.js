import orderService from "../services/order-service.js";

const cekout = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await orderService.order(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const weebhookMidtrans = async (req, res, next) => {
  try {
    const result = await orderService.weebhookMidtrans(req.body);
    res
      .status(200)
      .json({
        message: "Thankyou midtrans",
      })
      .end();
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { order_id } = await req.query;
    if (order_id) {
      req.body.order_id = await order_id;
      req.body.user_id = await req.id;
      const result = await orderService.getByOrderId(req.body);
      res.status(200).json(result).end();
    } else {
      req.body.user_id = await req.id;
      const result = await orderService.getAll(req.body);
      res.status(200).json(result).end();
    }
  } catch (error) {
    next(error);
  }
};

export default { cekout, weebhookMidtrans, getAll };
