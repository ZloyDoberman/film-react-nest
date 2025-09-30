export interface TicketsDocument {
  film: string;
  session: string;
  daytime: Date;
  row: number;
  seat: number;
  price: number;
}

export interface OrderDocument {
  email: string;
  phone: string;
  tickets: TicketsDocument[];
}
