import { Component, Input } from '@angular/core';
import { IMessage } from '../models';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  @Input() message!: IMessage;


}
