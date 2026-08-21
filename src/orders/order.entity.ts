import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

 export enum OrderStatus{
    pending='pending',
    completed='completed',
    failed='failed'

}

// TODO: intern implements Order entity — instructor note: remember to test what happens if @Column() types are mismatched with validation DTOs
@Entity('orders')

export class Order {
  @PrimaryGeneratedColumn()
  id!:number;
  
  @Column()
  userId!:number;

  @Column({type:'decimal'})
  amount!:number;

  @Column({type:'varchar',default:'pending'})
  status!:OrderStatus;

  @CreateDateColumn()
  createdAt!:Date;


}
