import {Column,PrimaryGeneratedColumn,OneToMany,Entity,CreateDateColumn} from 'typeorm'
import { Order } from '@/orders/order.entity'

@Entity('users')

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  passwordHash: string; 

  @OneToMany(() => Order, (order) => order.userId)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;
}