export interface ArticleObject {
  id: string;
  title: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  link: string;
  type: 'announcement' | 'headline' | 'event' | 'story';
}
