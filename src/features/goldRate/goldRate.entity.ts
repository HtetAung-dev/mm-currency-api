import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class GoldRate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("float")
  rate!: number;

  @Column("float", { default: 0 })
  changeValue!: number;

  @Column("float", { nullable: true })
  buyRate!: number;

  @Column("float", { nullable: true })
  sellRate!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
