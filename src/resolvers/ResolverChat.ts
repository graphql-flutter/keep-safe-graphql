import {
  Subscription,
  Mutation,
  Root,
  Query,
  Resolver,
  Arg,
  PubSub,
  PubSubEngine,
} from "type-graphql";
import { Chat } from "../entities/Chat";

let chats: Chat[] = [];
const new_mesage = "NEW_MESSAGE_CHANNEL";
const new_chat = "NEW_CHAT_CHANNEL";

@Resolver()
export class ChatResolver {
  @Query(() => [Chat])
  getChats(): Chat[] {
    return chats;
  }

  @Mutation(() => Chat)
  async createChat(
    @PubSub() pubSub: PubSubEngine,
    @Arg("name") name: string,
    @Arg("description") description: string
  ): Promise<Chat> {
    const chat = { id: chats.length + 1, name, description };
    chats.push(chat);
    await pubSub.publish(new_chat, undefined);
    return chat;
  }

  // should delete all the chats, greater than the id provided.
  @Mutation(() => Chat)
  deleteTestChats(@Arg("id") id: number): Chat {
    for (let i = chats.length; i > id; i--) {
      chats.pop();
    }
    return chats[chats.length - 1];
  }

  @Subscription({ topics: new_mesage })
  messageSent(@Root() { id, name, description }: Chat): Chat {
    return { id, name, description };
  }

  @Subscription({ topics: new_chat })
  chatCreated(): Chat {
    // TODO: check how to write a subscrition in the following case
    if (chats.length === 0)
      return { id: -1, name: "none", description: "none" };
    return chats[chats.length - 1];
  }
}
