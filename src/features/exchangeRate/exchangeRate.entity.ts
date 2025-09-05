import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm'
import { Currency } from '../currency/currency.entity'

@Entity()
@Unique(['fromCurrency', 'toCurrency'])
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Currency, (currency) => currency.ratesFrom)
  fromCurrency!: Currency

  @ManyToOne(() => Currency, (currency) => currency.ratesTo)
  toCurrency!: Currency

  @Column('float')
  rate!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}
