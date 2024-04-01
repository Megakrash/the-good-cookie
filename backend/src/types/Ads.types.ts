import { FindOperator } from 'typeorm'
import { SubCategory } from '../entities/SubCategory'

export type AdsQueryWhere = {
  subCategory?: FindOperator<SubCategory> | SubCategory
  title?: FindOperator<string>
  price?: FindOperator<number>
  //   tags?: { id: FindOperator<string[]> }
}
