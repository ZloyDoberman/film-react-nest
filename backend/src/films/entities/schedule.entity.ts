import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Films } from './film.entity';

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'text' })
  taken: string;

  @Column('uuid')
  filmId: string;

  @ManyToOne(() => Films, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Films;
}
