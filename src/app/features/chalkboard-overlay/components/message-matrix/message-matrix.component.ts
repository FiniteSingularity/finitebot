import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmoteMessage } from 'src/app/models/emote-message';

@Component({
  selector: 'app-message-matrix',
  templateUrl: './message-matrix.component.html',
  styleUrls: ['./message-matrix.component.scss']
})
export class MessageMatrixComponent implements OnInit {
  @Input() message: EmoteMessage;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log(this.message);
    // this.http.get(
    //   `http://192.168.1.115/message?message=${this.message}&red=255&green=128&blue=128`
    // ).subscribe((resp) => {console.log(resp);});
  }

}
