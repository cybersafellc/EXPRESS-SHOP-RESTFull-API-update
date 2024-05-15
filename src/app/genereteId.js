class GenereteID {
  constructor(prismaClient) {
    this.prismaClient = prismaClient;
  }

  async run() {
    const { prismaClient } = this;
    const datas = await prismaClient.findMany();
    const TempId = datas.length + 1;
    const count = await prismaClient.count({
      where: {
        id: TempId,
      },
    });

    if (!count) {
      return TempId;
    } else {
      for (let i = 0; i < datas.length; i++) {
        const count = await prismaClient.count({
          where: {
            id: i + 1,
          },
        });

        if (!count) {
          return (await i) + 1;
        }
      }
    }
  }

  async orderId() {
    const { prismaClient } = this;
    const datas = await prismaClient.findMany();
    const TempId = datas.length + 1;
    const count = await prismaClient.count({
      where: {
        order_id: `ORDER-839430${TempId}-08237`,
      },
    });

    if (!count) {
      return `ORDER-839430${TempId}-08237`;
    } else {
      for (let i = 0; i < datas.length; i++) {
        const count = await prismaClient.count({
          where: {
            order_id: `ORDER-839430${TempId}-08237`,
          },
        });

        if (!count) {
          return await `ORDER-839430${i + 1}-08237`;
        }
      }
    }
  }
}

export default GenereteID;
