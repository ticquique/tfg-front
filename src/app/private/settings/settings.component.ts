
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'settings',
  providers: [

  ],
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  public ngOnInit() {

    console.log('hello `Settings` component');
  }

}
