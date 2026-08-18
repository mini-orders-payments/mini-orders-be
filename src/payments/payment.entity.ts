import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, } from "typeorm";


export enum PaymentStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}

@Entity("payments")

export class Payment{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    orderNumber:number;

    @Column()
    amount:number;

    @Column()
    merchantRequestId:string;

    @Column()
    checkoutRequestId:string;

    @Column({type: 'varchar', length: 15, nullable: true})
    phoneNumber:string;

    @Column({nullable:true})
    paymentCode:string;

    @Column({ type:'enum',enum:PaymentStatus, default:PaymentStatus.pending})
    status:PaymentStatus;
    
    @Column({ nullable: true })
    resultDesc: string;

    @CreateDateColumn()
    createdAt: Date;

}