import { Field, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class PointType {
  @Field()
  type!: string

  @Field(() => [Number])
  coordinates!: [number, number]
}

@InputType()
export class PointInput {
  @Field()
  type!: string

  @Field(() => [Number])
  coordinates!: [number, number]
}
