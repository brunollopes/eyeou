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
        profile: 'https://lh4.googleusercontent.com/hl_rmEuT9UCPt8MidKlRNyQlBy5GjgriicpJObjab9KNwy-ovlk1HsuWoBIhjrBSkIywvx8b_LmmcxgQLt3hzZtOuiu0Otmj6rqNIniUAlhLm8awHQLGfpNiF3ORl2b5HeNsOBbT',
        position: {
          en: 'Photographer',
          pt: 'Fotógrafo'
        },
        info: {
          en: [
            'Over 30 years of professional photographer',
            'Photographer teacher',
            'Professional traveler photographer',
            'Portuguese N1 as world traveler',
            'Visited all countries in the world (204 countries) finishing it in 2011'
          ],
          pt: [
            'Mais de  30 anos como fotógrafo profissional',
            'Professor em fotografia',
            'Fotógrafo profissional de viagens',
            'Português número 1 mais viajado',
            'Visitou todos os países do mundo (204 países) terminando em 2011'
          ]
        },
        url: 'nlphotographer.com',
        href: 'http://nlphotographer.com'
      },
      {
        name: 'Angelo Lucas',
        profile: 'https://lh3.googleusercontent.com/eX0xJ6hASNFl67tHumhxKu7zPaptef1GNq3wLdWH-odHAJoLiO9eF9NVsOsW8AGai_qrH55THRIuea5DvQTpo5DvUOXkCRkmWTs1ruRDPHnZO9zHi6GZk7lDZXnnLOdkyCFcdaoL',
        position: {
          en: 'Photographer',
          pt: 'Fotógrafo'
        },
        info: {
          en: [
            'Over 20 years of professional photographer',
            'Photographer teacher',
            'Videographer, photojournalist, documentarian'
          ],
          pt: [
            'Mais de 20 anos como fotógrafo profissional',
            'Professor em fotografia',
            'Cinegrafista, foto jornalista, documentarista'
          ]
        },
        url: 'angelolucas.com',
        href: 'http://angelolucas.com'
      },
      {
        name: 'Tiago Maya',
        profile: '../../../assets/images/judge.jpg',
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
            'Estágio na foto VII em Brooklyn, NY.',
            'Atualmente trabalha como Visual Content Creator e Advisor de várias marcas.'
          ]
        },
        url: 'tiagomaya.com',
        href: 'http://tiagomaya.com'
      }
    ];
  }

  ngOnInit() {
  }

}
