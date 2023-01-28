// src/utils/sync-ratings.ts

import { Prisma, PrismaClient } from "@prisma/client";
// const { parse } = require("csv-parse");
// const fs = require("fs");

export const syncRatings = async (csvPath: string) => {
    // const data = [];
    // fs.createReadStream(csvPath)
    // .pipe(
    //     parse({
    //         delimiter: ",",
    //         columns: true,
    //         ltrim: true,
    //     })
    // ).on("data", (row) => {
    //     data.push(row);
    // }).on("error", (err) => {
    //     console.error(err);
    // }).on("end", () => {
    //     console.log(data);
    // });
}

// interface Rating {
//     modelId: string;
//     author: string;
//     bestPossible: IsBestOrientation;
//     quality: number;
//     reasoning: string;
// }