import type { MockAlbum } from "./album";

export type MockVideo = {
  id: string;
  title: string;
  uploaderName: string;
  createdAt: Date;
  album: MockAlbum;
};
