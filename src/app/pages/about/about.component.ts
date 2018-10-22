import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public slidertitle: any
  constructor(public translate: TranslateService) {
    this.slidertitle = [
      {
        name: 'Bruno Lopes',
        profile: 'https://s3.amazonaws.com/eyeou-public/bruno.jpeg',
        position: {
          en: 'Founder & CEO',
          pt: 'Founder & CEO'
        },
        info: {
          en: [
            'Visual Artist'
          ],
          pt: [
            'Artista Visual'
          ]
        },
        url: 'linkedin',
        href: 'http://linkedin.com/in/brunollopes/'
      },
      {
        name: 'Bruno Guazina',
        profile: 'https://s3.amazonaws.com/eyeou-public/grun.jpeg',
        position: {
          en: 'Product designer ',
          pt: 'Product designer '
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
        url: 'linkedin',
        href: 'https://www.linkedin.com/in/bguazina/'
      },
      {
        name: 'Mustafa Ahmed',
        profile: 'https://s3.amazonaws.com/eyeou-public/grun.jpg',
        position: {
          en: 'Developer',
          pt: 'Developer'
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
        href: 'https://www.upwork.com/freelancers/~0171c941c1aeba7c63'
      }
    ];
  }

  ngOnInit() {
  }

}
