import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Chat {
  @Field()
  id: number;

  @Field()
  description: string;

  @Field()
  name: string;

  // TODO: add the list of the message
}
