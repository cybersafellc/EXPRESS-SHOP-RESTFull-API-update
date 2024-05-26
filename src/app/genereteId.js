import crypto from "crypto";

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
    const id = await crypto.randomInt(1000, 99999999);
    const date =
      await `${new Date().getTime()}-${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}`;
    return await `${date}-${id}`;
  }

  async genereteUserId() {
    return await crypto.randomUUID();
  }
}

export default GenereteID;
