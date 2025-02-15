import { SiweMessage } from "siwe";
import { Users } from "../dbTypes";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async verifyUser(args: {
    message: string;
    signature: string;
    nonce: string;
  }): Promise<SiweMessage> {
    const siweMessage = new SiweMessage(args.message);
    const { data: message } = await siweMessage.verify({
      signature: args.signature,
      nonce: args.nonce,
    });

    return message;
  }

  async getUser(id: string): Promise<Users | undefined> {
    return await this.userRepository.getById(id);
  }

  async createOrUpdateUser(args: {
    id: string;
    address: string;
  }): Promise<Users> {
    return await this.userRepository.createOrUpdate(args);
  }
}
