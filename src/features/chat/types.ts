import { SpaceCategory } from "../spaces/types";

export type Chat = {
  id: number;
  name: string;
  category: SpaceCategory;
  background: string;
};


export interface Channel {
  id: string;
  name: string;
}