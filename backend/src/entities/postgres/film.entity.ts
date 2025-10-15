import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedules } from './schedule.entity';

@Entity()
export class Films {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  rating: number;

  @Column()
  director: string;

  @Column({ type: 'text' })
  tags: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedules, (schedule) => schedule.film, {
    cascade: true, // автоматически сохраняет/обновляет/удаляет связанные сущности
    onDelete: 'CASCADE', // при удалении родителя удаляются связанные записи
    onUpdate: 'CASCADE', // при обновлении — обновляются связанные записи
  })
  schedules: Schedules[];
}
