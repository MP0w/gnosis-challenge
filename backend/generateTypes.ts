import { updateTypes } from "knex-types";
import { dbConnection } from "./dbConnection";
import { Transform, Writable } from "stream";
import { createWriteStream } from "fs";

let isFirst = true;

const customTypes = ``;

const transformer = new Transform({
  transform(chunk, _, callback) {
    if (isFirst) {
      this.push("// This file is auto-generated. Do not edit it manually.\n");
      this.push(customTypes);
      isFirst = false;
    }

    const data = chunk.toString();

    if (data.includes("//")) {
      this.push("\n");
    } else {
      this.push(data);
    }
    callback();
  },
});

const output = createWriteStream("./dbTypes.ts");

const combinedStream = new Writable({
  write(chunk, encoding, callback) {
    transformer.write(chunk, encoding, () => {
      output.write(transformer.read(), callback);
    });
  },
});

updateTypes(dbConnection, {
  output: combinedStream,
  exclude: ["knex_migrations", "knex_migrations_lock"],
}).catch((error) => {
  console.error("Error generating types:", error);
  process.exit(1);
});

// Ensure streams are properly closed when done
combinedStream.on("finish", () => {
  transformer.end();
  output.end();
});
