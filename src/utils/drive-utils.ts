// src/utils/drive-utils.ts

import next from "next";
import { env } from "../env/client.mjs";
// get all the files associated with a specific folder id from drive
export const getAllDriveFilesIn = async (folderId: string) => {
  // const response = await drive.files.list({
  //     q: '"' + folderId + '"' + "+in+parents",
  //     key: env.NEXT_PUBLIC_GOOGLE_API_KEY,
  // });
  // return response.data;

  // TODO: use the actual drive api
  let nextPageToken = null;
  let files: GoogleDriveFile[] = [];
  const PAGE_SIZE = 1000;
  let i = 0;
  do {
    console.log(`page ${i} for ${folderId}`);
    let query = `https://www.googleapis.com/drive/v3/files?q=%22${folderId}%22+in+parents&pageSize=${PAGE_SIZE}&key=${env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    if (nextPageToken) {
      query += `&pageToken=${nextPageToken}`;
    }
    // console.log(query);
    nextPageToken = await fetch(query).then((res) => {
      return res.json().then((data) => {
        files = files.concat(data.files);
        // console.log(data);
        return data.nextPageToken;
      });
    });
    i++;
  } while (nextPageToken);
  return files;
};

export interface GoogleDriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}
