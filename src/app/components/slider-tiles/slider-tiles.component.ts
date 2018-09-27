import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-slider-tiles',
  templateUrl: './slider-tiles.component.html',
  styleUrls: ['./slider-tiles.component.css']
})
export class SliderTilesComponent implements OnInit {

  public slidertitle: any[];
  constructor(public translate: TranslateService) {
    this.slidertitle = [
      {
        name: 'Ana Mandes',
        profile: 'https://s3.amazonaws.com/eyeou-public/anaa.png',
        position: {
          en: 'Photographer',
          pt: 'Fotógrafo'
        },
        info: {
          en: [
            'Visual Artist'
          ],
          pt: [
            'Artista Visual'
          ]
        },
        url: 'instagram',
        href: 'https://www.instagram.com/by_anamendes/'
      },
      {
        name: 'Angelo Lucas',
        profile: 'https://s3.amazonaws.com/eyeou-public/angelo.jpeg',
        position: {
          en: 'Photographer',
          pt: 'Fotógrafo'
        },
        info: {
          en: [
            'Over 20 years of professional photographer',
            'Photographer teacher',
            'photojournalist, documentarian'
          ],
          pt: [
            'Mais de 20 anos como fotógrafo profissional',
            'Professor em fotografia',
            'fotojornalista, documentarista'
          ]
        },
        url: 'website',
        href: 'http://angelolucas.com'
      },
      {
        name: 'Tiago Maya',
        profile: 'https://s3.amazonaws.com/eyeou-public/SmartSelect_20180905-071018_Gallery-min.jpg',
        position: {
          en: 'Photographer',
          pt: 'Fotógrafo'
        },
        info: {
          en: [
            'Over 15 years as a professional photographer.',
            'Internship with VII photo in Brooklyn, NY.',
            'Currently works as a visual content creator and advisor for several brands.'
          ],
          pt: [
            'Mais de 15 anos como fotógrafo profissional.',
            'Estágio na agȇncia VII em Brooklyn, NY.',
            'Atualmente trabalha como Visual Content Creator e Advisor de várias marcas.'
          ]
        },
        url: 'website',
        href: 'http://tiagomaya.com'
      }
    ];
  }

  ngOnInit() {
  }

}
