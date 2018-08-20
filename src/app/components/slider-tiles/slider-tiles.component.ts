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
        name: 'Nuno Lobito',
        profile: '../../../assets/images/imagesFooter_04.png',
        position: {
          en: 'Photographer Pro',
          pt: 'Fotógrafo Pro'
        },
        info: {
          en: 'Over 30 years of professional photographer and teacher Photographer teacher Professional traveler photographer Portuguese N1 as world traveler Visited all countries in the world (204 countries)',
          pt: 'Mais de  30 anos como fotógrafo profissional Professor em fotografia Fotógrafo profissional de viagens Português número 1 mais viajado Visitou todos os países do mundo (204 países) terminando em 2011/11/11'
        },
        url: 'nlphotographer.com'
      },
      {
        name: 'Angelo Lucas',
        profile: '../../../assets/images/imagesFooter_05.png',
        position: {
          en: 'Photographer Pro',
          pt: 'Fotógrafo Pro'
        },
        info: {
          en: 'Over 20 years of professional photographer Photographer teacher Videographer, photojournalist, documentarian',
          pt: 'Mais de 20 anos como fotógrafo profissional Professor em fotografia Cinegrafista, foto jornalista, documentarista'
        },
        url: 'angelolucas.com'
      },
      {
        name: 'Tiago Maya',
        profile: '../../../assets/images/imagesFooter_03.png',
        position: {
          en: 'Photographer Pro',
          pt: 'Fotógrafo Pro'
        },
        info: {
          en: 'Over 15 years of professional photographer Internship with VII photo Works for fashion and advertising within the Portuguese market and overseas.',
          pt: 'Mais de 15 anos como fotógrafo profesional Estágio em VII photo Trabalha dentro da moda e publicidade em Portugal e fora.'
        },
        url: 'tiagomaya.com'
      }
    ];
  }

  ngOnInit() {
  }

}
