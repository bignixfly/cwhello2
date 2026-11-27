import { appRoot } from "@prisma/composer";
import { dataContract, postgres } from "@prisma/composer-prisma-cloud/orm";
import contractJson from "./src/prisma/contract.json" with { type: "json" };
import web from "./src/service.mts";

const dbResource = postgres({
  name: "db",
  contract: dataContract(contractJson),
  config: "./prisma.config.ts",
});

export default appRoot("dodoumir", ({ provision }) => {
  const db = provision(dbResource);
  provision(web, { deps: { db } });
});
