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

const chats: Chat[] = [];
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
    @Arg("desciption") description: string
  ): Promise<Chat> {
    const chat = { id: chats.length + 1, name, description };
    chats.push(chat);
    const payload = chat;
    await pubSub.publish(new_chat, payload);
    return chat;
  }

  @Subscription({ topics: new_mesage })
  messageSent(@Root() { id, name, description }: Chat): Chat {
    return { id, name, description };
  }

  @Subscription({ topics: new_chat })
  chatCreated(@Root() { id, name, description }: Chat): Chat {
    return { id, name, description };
  }
}
