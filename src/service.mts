import { compute } from "@prisma/composer-prisma-cloud";
import { dataContract, postgres } from "@prisma/composer-prisma-cloud/orm";
import node from "@prisma/composer/node";
import contractJson from "./prisma/contract.json" with { type: "json" };
import type { Contract } from "./prisma/contract.d.ts";

const contract = dataContract<Contract>(contractJson);

export default compute({
  name: "web",
  deps: { db: postgres(contract) },
  build: node({
    module: import.meta.url,
    dir: "../dist",
    entry: "./server.mjs",
  }),
});
