export interface Wisher {
  username: string;
  wishes?: Wish[];
  dbKey?: string;
}
export class Wish {
  constructor(
    public title: string,
    public taken: boolean,
    public taker: string | null,
    public link?: string
  ) {}
}
