export interface Person {
  username: string;
  dbKey?: string;
}
export interface Friend extends Person {
  pending: boolean;
  wishes?: Wish[];
}
export interface Wisher extends Person {
  wishes?: Wish[];
  friends?: Friend[];
  requests?: Person[];
}
export class Wish {
  constructor(
    public title: string,
    public taken: boolean,
    public taker: string | null,
    public link?: string
  ) {}
}
