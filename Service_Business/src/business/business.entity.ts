import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ''
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: ''
  })
  issued: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: ''
  })
  expired: string;

  @Column({
    type: 'text',
    nullable: false,
    default: ''
  })
  history: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ''
  })
  license_key: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: ''
  })
  product_version: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false
  })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false
  })
  updated: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true
  })
  removed: Date | null;
}