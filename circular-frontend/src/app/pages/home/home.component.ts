import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ArticleObject } from '../interfaces/article-object.interface';
import { HeadlinesComponent } from '../headlines/headlines.component';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent, HeadlinesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  protected readonly _headlines: ArticleObject[] = [
    {
      id: '1',
      title: 'Neue Kleidertausch-Party in Berlin!',
      date: '2025-11-05',
      author: 'Team KleidungTauschen',
      image: '/articleImg.jpg',
      summary:
        'Am kommenden Wochenende findet unsere größte Kleidertausch-Veranstaltung des Jahres in Berlin statt. Bring deine alten Lieblingsstücke mit und entdecke neue!',
      link: '/news/berlin-event',
      type: 'headline',
    },
    {
      id: '2',
      title: 'Nachhaltigkeit im Alltag – Tipps von unserer Community',
      date: '2025-10-27',
      author: 'Team Event',
      image: '/articleImg.jpg',
      summary:
        'Wie kannst du deinen Kleiderschrank nachhaltiger gestalten? Unsere Community teilt ihre besten Tipps für bewussten Konsum und Second-Hand-Shopping.',
      link: '/news/sustainability-tips',
      type: 'headline',
    },
    {
      id: '3',
      title: 'Kleidertausch jetzt auch in München verfügbar!',
      date: '2025-10-15',
      author: 'Team KleidungTauschen',
      image: '/articleImg.jpg',
      summary:
        'Gute Nachrichten für alle in Bayern – unser Kleidertausch-Projekt startet ab sofort auch in München. Registriere dich kostenlos und finde lokale Events.',
      link: '/news/munich-launch',
      type: 'headline',
    },
  ];
}
