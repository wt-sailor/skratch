import { Injectable, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(public messagesRepo: MessagesRepository) {}

  async findOne(id: string) {
    const content = await this.messagesRepo.findOne(id);

    if (!content) {
      throw new NotFoundException('Message not found');
    }
    return content;
  }

  findAll() {
    return this.messagesRepo.findAll();
  }

  create(message: string) {
    return this.messagesRepo.create(message);
  }
}
