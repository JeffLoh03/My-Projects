export interface Diary {
  _id?: string;
  title: string;
  content: string;
  date: Date;
  emotion: 'Joy' | 'Sadness' | 'Anger' | 'Anxiety' | 'Numb';
}
