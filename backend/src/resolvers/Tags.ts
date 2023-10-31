import { Arg, Query, Resolver } from "type-graphql";
import { Tag } from "../entities/Tag";

@Resolver(Tag)
export class TagsResolver {
  @Query(() => [Tag])
  async tagsGetAll(): Promise<Tag[]> {
    const tags = await Tag.find({
      relations: { ads: true },
    });
    return tags;
  }
  @Query(() => Tag)
  async tagById(@Arg("id") id: number): Promise<Tag> {
    const tag = await Tag.findOneBy({ id });
    if (!tag) {
      throw new Error("Tag not found");
    }
    return tag;
  }
}
