// src/utils/drive-utils.ts

import { env } from "../env/client.mjs";
// get all the files associated with a specific folder id from drive
export const getDriveFilesIn = async (folderId: string) => {
    // const response = await drive.files.list({
    //     q: '"' + folderId + '"' + "+in+parents",
    //     key: env.NEXT_PUBLIC_GOOGLE_API_KEY,
    // });
    // return response.data;
    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=%22${folderId}%22+in+parents&key=${env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    return response.json().then((data) => data.files);
}