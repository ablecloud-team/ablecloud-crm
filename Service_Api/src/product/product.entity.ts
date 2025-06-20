import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('product')
export class Product {
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
    length: 50,
    nullable: false,
    default: ''
  })
  version: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ''
  })
  isoFilePath: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ''
  })
  checksum: string;

  @Column({
    type: 'tinyint'
  })
  enabled: boolean;

  @Column({
    type: 'text',
    nullable: true
  })
  contents: string;

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