import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

 export enum OrderStatus{
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    FAILED='FAILED'

}

// TODO: intern implements Order entity — instructor note: remember to test what happens if @Column() types are mismatched with validation DTOs
@Entity('orders')

export class Order {
  @PrimaryGeneratedColumn()
  id!:number;
  
  @Column()
  userId!:number;

  @Column({type:'integer'})
  orderNumber!:number;

  @Column({type:'decimal'})
  amount!:number;

  @Column({type:'varchar',default:'PENDING'})
  status!:OrderStatus;

  @CreateDateColumn()
  createdAt!:Date;


}
