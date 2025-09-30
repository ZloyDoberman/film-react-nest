import { Schema } from 'mongoose';
import { OrderDocument } from '../order/order.interface';
import validator from 'validator';

export const OrderSchema = new Schema<OrderDocument>({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат email',
    },
  },
  phone: {
    type: String,
    required: true,
  },
  tickets: [
    {
      film: {
        type: String,
        required: true,
      },
      session: {
        type: String,
        required: true,
      },
      daytime: {
        type: Date,
        required: true,
      },
      row: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      seat: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});
