import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const contents = readFile('messages.json', 'utf-8');
    const messages = JSON.parse(await contents);
    return messages[id];
  }
  async findAll() {
    const contents = readFile('messages.json', 'utf-8');
    const messages = JSON.parse(await contents);
    return messages;
  }
  async create(message: string) {
    const contents = readFile('messages.json', 'utf-8');
    const messages = JSON.parse(await contents);
    const id = Math.floor(Math.random() * 999);
    const newMessage = {
      id,
      content: message,
    };
    messages[id] = newMessage;
    await writeFile('messages.json', JSON.stringify(messages));
    return { message: 'Message created successfully', id };
  }
}
