import { Arg, Query, Resolver, Mutation, ID, Authorized } from 'type-graphql'
import { validate } from 'class-validator'
import { Tag, TagCreateInput, TagUpdateInput } from '../entities/Tag'

@Resolver(Tag)
export class TagsResolver {
  @Query(() => [Tag])
  async tagsGetAll(): Promise<Tag[]> {
    const tags = await Tag.find({
      relations: { ads: true },
      order: {
        id: 'ASC',
      },
    })
    return tags
  }

  @Query(() => Tag)
  async tagById(@Arg('id') id: number): Promise<Tag> {
    const tag = await Tag.findOne({
      where: { id },
      relations: { ads: true },
    })
    if (!tag) {
      throw new Error('Tag not found')
    }
    return tag
  }

  @Authorized('ADMIN')
  @Mutation(() => Tag)
  async tagCreate(
    @Arg('data', () => TagCreateInput) data: TagCreateInput
  ): Promise<Tag> {
    const newTag = new Tag()
    Object.assign(newTag, data)
    const tagName: string = data.name
    const existingTag = await Tag.findOne({
      where: { name: tagName },
    })

    if (existingTag) {
      throw new Error(`Tag name "${tagName}" already in use`)
    } else {
      const errors = await validate(newTag)
      if (errors.length === 0) {
        await newTag.save()
        return newTag
      }
      throw new Error(`Error occured: ${JSON.stringify(errors)}`)
    }
  }

  @Authorized('ADMIN')
  @Mutation(() => Tag, { nullable: true })
  async tagUpdate(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: TagUpdateInput
  ): Promise<Tag | null> {
    const updatedTag = await Tag.findOne({
      where: { id },
    })
    if (updatedTag) {
      Object.assign(updatedTag, data)

      const errors = await validate(updatedTag)
      if (errors.length === 0) {
        await updatedTag.save()
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }
    return updatedTag
  }

  @Authorized('ADMIN')
  @Mutation(() => Tag, { nullable: true })
  async tagDelete(@Arg('id', () => ID) id: number): Promise<Tag | null> {
    const tag = await Tag.findOne({
      where: { id },
    })
    if (tag) {
      await tag.remove()
      tag.id = id
    }
    return tag
  }
}
