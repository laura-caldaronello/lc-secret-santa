export interface User {
  username: string;
  wishes: Wish[] | null;
}

interface Wish {
  title: string;
  link?: string;
  taken: boolean;
  taker: string | null;
}
