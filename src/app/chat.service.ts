import { inject, Injectable } from '@angular/core';
import { IChannel, IMessage } from './models';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  authService = inject(AuthService);
  userName?: string = this.authService.getChannelName();
  channels: IChannel[] = [];
  private ws?: WebSocket;
  private url = 'wss://irc-ws.chat.twitch.tv:443';

  chosenChannel$ = new BehaviorSubject<IChannel | null>(null);
  removedChannel$ = new Subject<IChannel>();
  newMessage$ = new Subject<IMessage>();

  constructor() {
    const token = this.authService.getToken();
    this.removedChannel$
      .pipe(
        tap((channel) => {
          this.channels = this.channels.filter((c) => c.name !== channel.name);
          this.saveChannels();
        })
      )
      .subscribe();

    if (token) {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.ws!.send(`PASS oauth:${token}`);
        this.ws!.send(`NICK ${this.userName}`);
        this.loadChannels();
        this.joinAll();
      };
      this.ws.onmessage = (message) =>
        message.data
          .split('\r\n')
          .map((content: string) => this.handleMessage(content));
    }
  }

  join(channel: string) {
    this.ws!.send(`JOIN #${channel}`);
  }

  leave(channel: string) {
    this.ws!.send(`PART #${channel}`);
  }

  private pong(message: string) {
    this.ws!.send(message.replace('PING', 'PONG'));
  }

  sendMessage(content: string, channelName: string) {
    this.ws!.send(`PRIVMSG #${channelName} :${content}`);
    const channel = this.channels.find(
      (channel) => channel.name === channelName
    );

    const message: IMessage = {
      channel: channelName,
      sender: this.userName!,
      isReply: true,
      content,
    };
    channel?.messages.push(message);
    this.newMessage$.next(message);
  }

  private handleMessage(message: string) {
    if (!message) {
      return;
    }

    if (message.startsWith('PING')) {
      this.pong(message);
      return;
    }
    const messageSeperated = message.split(' ');
    const command = messageSeperated[1];
    if (command === 'PRIVMSG') {
      const content = messageSeperated.slice(3).join(' ').substring(1);
      let sender = messageSeperated[0];
      const channelName = messageSeperated[2].substring(1);
      let isReply = false;
      sender = sender.split('!')[0].substring(1);
      if (sender.toLocaleLowerCase() === this.userName?.toLocaleLowerCase()) {
        sender = this.userName!;
        isReply = true;
      }
      const channel = this.channels.find(
        (channel) => channel.name === channelName
      );

      const message = {
        channel: channelName,
        sender,
        isReply,
        content,
      };
      channel?.messages.push(message);
      this.newMessage$.next(message);

      return;
    }

    if (command === 'JOIN') {
      if (!messageSeperated[0].includes('tmi.twitch.tv')) {
        return;
      }

      const channelName = messageSeperated[2].substring(1);

      if (this.channels.find((channel) => channel.name === channelName)) {
        return;
      }
      const channel: IChannel = {
        name: channelName,
        messages: [],
      };
      this.channels.push(channel);
      this.saveChannels();

      return;
    }

    if (command === 'PART') {
      if (!messageSeperated[0].includes('tmi.twitch.tv')) {
        return;
      }

      if (!this.channels.find((channel) => channel.name === channelName)) {
        return;
      }

      const channelName = messageSeperated[2].substring(1);
      this.channels = this.channels.filter(
        (channel) => channel.name === channelName
      );
      this.saveChannels();
      return;
    }
  }

  chooseChannel(channelName: string) {
    const channel = this.channels.find(
      (channel) => channel.name === channelName
    );
  }

  saveChannels() {
    const channelsNames = this.channels.map((channel) => channel.name);
    localStorage.setItem('channels', channelsNames.join(','));
  }

  loadChannels() {
    const channels = localStorage.getItem('channels')?.split(',');
    if (!channels) {
      return;
    }
    channels.map((channel) =>
      this.channels.push({
        name: channel,
        messages: [],
      })
    );
  }

  removeChannels() {
    localStorage.removeItem('channels');
  }

  joinAll() {
    if (this.channels.length === 0) {
      return;
    }
    const channels = this.channels
      .map((channel) => `#${channel.name}`)
      .join(',');
    this.join(channels.slice(1));
  }
}
