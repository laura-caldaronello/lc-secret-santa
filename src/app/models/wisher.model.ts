export interface Wisher {
  username: string;
  wishes?: Wish[] | Wish;
}

export interface Wish {
  title: string;
  link?: string;
  taken: boolean;
  taker: string | null;
}
