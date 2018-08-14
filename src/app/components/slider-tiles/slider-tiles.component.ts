import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-tiles',
  templateUrl: './slider-tiles.component.html',
  styleUrls: ['./slider-tiles.component.css']
})
export class SliderTilesComponent implements OnInit {

  public slidertitle : any[];
  constructor() { 
    this.slidertitle = [
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_04.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_05.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_03.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_04.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_03.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'},
      {name: 'NONU LOBITO',profile : '../../../assets/images/imagesFooter_05.png', position : 'Photographer Pro', info : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'}
    ];
  }

  ngOnInit() {
  }

}
