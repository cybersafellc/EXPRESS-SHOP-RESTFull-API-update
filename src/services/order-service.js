import validate from "../validations/validate.js";
import orderValidation from "../validations/order-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import GenereteID from "../app/genereteId.js";
import midtransClient from "midtrans-client";
import Response from "../app/response.js";
import axios from "axios";

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.APP_SERVER_KEY,
  clientKey: process.env.APP_CLIENT_KEY,
});

const order = async (request) => {
  const result = await validate(orderValidation.cekout, request);

  const address = await prismaClient.address.findFirst({
    where: {
      id: result.address_id,
      user_id: result.user_id,
    },
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      country: true,
      zip_code: true,
      phone_number: true,
    },
  });
  if (!address)
    throw new ResponseError(
      400,
      `your address with address_id ${result.address_id} notfound`
    );
  const item_details = await [];
  const order_id = await new GenereteID(prismaClient.orders).orderId();
  let gross_amount = await 0;

  for (let i = 0; i < result.cart_id.length; i++) {
    let cart = await prismaClient.cart.findFirst({
      where: {
        id: result.cart_id[i],
        user_id: result.user_id,
      },
    });
    if (!cart) continue;

    const product = await prismaClient.product.findFirst({
      where: {
        id: cart.product_id,
      },
    });
    if (!product)
      throw new ResponseError(400, `product id: ${cart.product_id} notfound`);

    if (cart.qty > product.stocks)
      throw new ResponseError(
        "400",
        `product ${product.name} stock only ${product.stocks}`
      );

    // ilangin stock sesuai qty dan tambahin sold
    await prismaClient.product.update({
      data: {
        stocks: product.stocks - cart.qty,
        sold: product.sold + cart.qty,
      },
      where: {
        id: product.id,
      },
    });

    cart.product = await product;
    await delete cart.product.stocks;
    await delete cart.product.description;
    await delete cart.product.sold;
    await delete cart.product.rating;
    await delete cart.product.img_url;
    cart.product.qty = await cart.qty;
    cart.product.total = (await cart.product.qty) * cart.product.price;
    cart = await cart.product;
    gross_amount += await cart.total;

    // delete cart berdasarkan id
    await prismaClient.cart.delete({
      where: {
        id: result.cart_id[i],
      },
    });

    // create transaction
    const idTrx = await new GenereteID(prismaClient.transaction).run();
    await prismaClient.transaction.create({
      data: {
        id: idTrx,
        order_id: order_id,
        product_id: cart.id,
        qty: cart.qty,
        price_product: cart.price,
        total_amount: cart.total,
      },
    });

    cart.quantity = await cart.qty;
    await delete cart.total;
    await delete cart.qty;
    await item_details.push(cart);
  }

  if (item_details.length <= 0)
    throw new ResponseError(
      400,
      "you dont have any products on your cart, please shopping now"
    );

  // create order
  const total_product = await item_details.length;

  const createOrder = await prismaClient.orders.create({
    data: {
      order_id: order_id,
      user_id: result.user_id,
      total_product: total_product,
      total_amount: gross_amount,
      status_order: "pending payment",
      address_id: address.id,
    },
  });

  // get token and payemnt redirect to midtrans
  const name = await address.name.split(" ");
  let parameter = await {
    transaction_details: await {
      order_id: createOrder.order_id,
      gross_amount: createOrder.total_amount,
    },
    item_details: item_details,
    customer_details: {
      billing_address: {
        first_name: name[0],
        last_name: name[1] + name[2],
        phone: address.phone_number,
        address: address.address_1,
        city: address.city,
        postal_code: address.zip_code,
        country_code: "IDN",
      },
    },
    shipping_address: {
      first_name: name[0],
      last_name: name[1] + name[2],
      phone: address.phone_number,
      address: address.address_1,
      city: address.city,
      postal_code: address.zip_code,
      country_code: "IDN",
    },
  };

  const dataTrx = await snap
    .createTransaction(parameter)
    .then(async (transaction) => {
      // transaction token
      let transactionToken = await transaction.token;
      let redirectUrl = await transaction.redirect_url;
      console.log(transaction);
      return await new Response(
        200,
        "successfully placed order",
        {
          transactionToken,
          redirectUrl,
        },
        redirectUrl,
        false
      );
    });

  return dataTrx;
};

const weebhookMidtrans = async (request) => {
  const result = await validate(orderValidation.weebhookMidtrans, request);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${process.env.APP_SERVER_KEY_ENCODE}`,
  };

  await axios
    .get(`https://api.sandbox.midtrans.com/v2/${result.order_id}/status`, {
      headers,
    })
    .then(async (ress) => {
      if (
        ress.data.transaction_status === "settlement" ||
        ress.data.transaction_status === "capture"
      ) {
        await prismaClient.orders.update({
          data: {
            status_order: "preparing for shipment",
          },
          where: {
            order_id: ress.data.order_id,
          },
        });
        return;
      } else if (
        ress.data.transaction_status === "deny" ||
        ress.data.transaction_status === "cancel" ||
        ress.data.transaction_status === "expire" ||
        ress.data.transaction_status === "failure" ||
        ress.data.transaction_status === "refund" ||
        ress.data.transaction_status === "partial_refund"
      ) {
        const transaction = await prismaClient.transaction.findMany({
          where: {
            order_id: ress.data.order_id,
          },
        });

        for (let i = 0; i < transaction.length; i++) {
          const product = await prismaClient.product.findFirst({
            where: {
              id: transaction[i].product_id,
            },
          });

          await prismaClient.product.update({
            data: {
              stocks: transaction[i].qty + product.stocks,
              sold: product.sold - transaction[i].qty,
            },
            where: {
              id: product.id,
            },
          });

          await prismaClient.canceled_transaction.create({
            data: transaction[i],
          });
        }

        await prismaClient.transaction.deleteMany({
          where: {
            order_id: ress.data.order_id,
          },
        });

        await prismaClient.orders.update({
          data: {
            status_order: "cancel",
          },
          where: {
            order_id: ress.data.order_id,
          },
        });
      } else {
        return;
      }
    });
  return;
};

const getAll = async (request) => {
  const result = await validate(orderValidation.getAll, request);
  const orders = await prismaClient.orders.findMany({
    where: {
      user_id: result.user_id,
    },
  });
  const dataNew = await Promise.all(
    orders.map(async (order) => {
      order.address = await prismaClient.address.findFirst({
        where: {
          id: order.address_id,
          user_id: order.user_id,
        },
      });
      await delete order.address_id;
      await delete order.address.user_id;
      await delete order.user_id;
      if (order.status_order === "cancel") {
        order.transactions = await prismaClient.canceled_transaction.findMany({
          where: {
            order_id: order.order_id,
          },
        });
        order.transactions = await Promise.all(
          order.transactions.map(async (transaction) => {
            const product = await prismaClient.product.findFirst({
              where: {
                id: transaction.product_id,
              },
              select: {
                name: true,
                img_url: true,
              },
            });
            return { ...transaction, ...product, order_id: undefined };
          })
        );
      } else {
        order.transactions = await prismaClient.transaction.findMany({
          where: {
            order_id: order.order_id,
          },
        });
        order.transactions = await Promise.all(
          order.transactions.map(async (transaction) => {
            const product = await prismaClient.product.findFirst({
              where: {
                id: transaction.product_id,
              },
              select: {
                name: true,
                img_url: true,
              },
            });

            return { ...transaction, ...product, order_id: undefined };
          })
        );
      }
      return await order;
    })
  );
  return await new Response(200, "successfully response", dataNew, null, false);
};

const getByOrderId = async (request) => {
  const result = await validate(orderValidation.getByOrderId, request);
  const order = await prismaClient.orders.findFirst({
    where: result,
  });
  if (!order) throw new ResponseError(404, "you dont have any orders");
  order.address = await prismaClient.address.findFirst({
    where: {
      user_id: order.user_id,
      id: order.address_id,
    },
  });
  order.address.user_id = await undefined;
  order.transactions = await prismaClient.transaction.findMany({
    where: {
      order_id: order.order_id,
    },
  });
  order.transactions = await Promise.all(
    order.transactions.map(async (transaction) => {
      const product = await prismaClient.product.findFirst({
        where: {
          id: transaction.product_id,
        },
        select: {
          name: true,
          img_url: true,
        },
      });
      return await { ...transaction, ...product, order_id: undefined };
    })
  );
  return await { ...order, address_id: undefined, user_id: undefined };
};
export default { order, weebhookMidtrans, getAll, getByOrderId };
