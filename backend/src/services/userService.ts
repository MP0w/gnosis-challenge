import { SiweMessage } from "siwe";
import { UserRepository } from "../repositories/userRepository";
import { UserDto } from "../entities/userDto";
import { Users } from "../dbTypes";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private makeUserDto(user: Users): UserDto {
    return {
      id: user.id,
      address: user.address,
    };
  }

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

  async getUser(id: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.getById(id);
    return user ? this.makeUserDto(user) : undefined;
  }

  async createOrUpdateUser(args: {
    id: string;
    address: string;
  }): Promise<UserDto> {
    return this.makeUserDto(await this.userRepository.createOrUpdate(args));
  }
}
