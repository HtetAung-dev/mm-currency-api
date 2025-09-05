import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ExchangeRate } from '../exchangeRate/exchangeRate.entity'

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  code!: string

  @Column()
  name!: string

  @OneToMany(() => ExchangeRate, (rate) => rate.fromCurrency)
  ratesFrom!: ExchangeRate[]

  @OneToMany(() => ExchangeRate, (rate) => rate.toCurrency)
  ratesTo!: ExchangeRate[]
}
