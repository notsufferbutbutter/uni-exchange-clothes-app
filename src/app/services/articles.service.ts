import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleObject } from '../pages/interfaces/article-object.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Dummy fallback data (frontend only). IDs are strings; backend uses numeric IDs.
const DUMMY_ARTICLES: ArticleObject[] = [
  {
    id: '1',
    title: 'Neue Kleidertausch-Party in Berlin!',
    date: '2025-11-05',
    author: 'Team KleidungTauschen',
    image: '/articleImg.jpg',
    summary:
      'Am kommenden Wochenende findet unsere größte Kleidertausch-Veranstaltung des Jahres in Berlin statt. Bring deine alten Lieblingsstücke mit und entdecke neue!',
    link: '/news/berlin-event',
    type: 'event',
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
    type: 'story',
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
    type: 'announcement',
  },
  {
    id: '4',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
  // additional duplicates for pagination demo
  {
    id: '5',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
  {
    id: '6',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
  {
    id: '7',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
  {
    id: '8',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
  {
    id: '9',
    title: 'Tausch statt Kauf: Warum Sharing die Zukunft ist',
    date: '2025-09-30',
    author: 'Gastbeitrag von Anna Müller',
    image: '/articleImg.jpg',
    summary:
      'Im Gastartikel erklärt Anna, warum gemeinschaftliches Tauschen nicht nur Geld spart, sondern auch einen wichtigen Beitrag zum Umweltschutz leistet.',
    link: '/news/sharing-future',
    type: 'headline',
  },
];

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly baseUrl = '/api/v1/articles';
  private readonly useBackend = true; // set false to always use dummy

  readonly articles = signal<ArticleObject[]>(DUMMY_ARTICLES);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadAll() {
    if (!this.useBackend) return; // keep dummy data

    this.loading.set(true);
    this.error.set(null);
    this.http.get<ArticleObject[]>(this.baseUrl)
      .pipe(
        catchError(err => {
          this.error.set('Backend unavailable -> showing dummy data');
          return of(DUMMY_ARTICLES);
        })
      )
      .subscribe(list => {
        this.articles.set(list.length ? list : DUMMY_ARTICLES);
        this.loading.set(false);
      });
  }
}