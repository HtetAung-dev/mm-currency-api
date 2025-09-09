import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from "typeorm";
import { Currency } from "../currency/currency.entity";

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Currency, (currency) => currency.ratesFrom)
  fromCurrency!: Currency;

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
