import { Entity } from 'typeorm';

// TODO: intern implements Order entity — instructor note: remember to test what happens if @Column() types are mismatched with validation DTOs
@Entity('orders')
export class Order {
  // TODO: add @PrimaryGeneratedColumn() id
  // TODO: add columns (e.g. status, amount) — leave unimplemented for Day 2
}
