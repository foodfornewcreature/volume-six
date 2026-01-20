export interface ContentBase {
  id: string;
  type: string;
}

export interface Chapter extends ContentBase {
  type: 'chapter';
  value: string;
}

export interface Heading extends ContentBase {
  type: 'heading';
  headingType: 'main' | 'sub';
  value: string;
}

export interface Hints extends ContentBase {
  type: 'hints';
  value: string[] | string;
}

export interface Text {
  type: 'text';
  value: string;
}

export interface Italic extends ContentBase {
  type: 'italic';
  value: string;
}

export interface Verse extends ContentBase {
  type: 'verse';
  value:string;
  link: string;
}

export interface EngPage {
  type: 'eng_page';
  value: string;
}

export interface Paragraph extends ContentBase {
  type: 'paragraph';
  content: (Text | Verse | EngPage | Italic | Bold)[];
}

export interface Page extends ContentBase {
  type: 'page';
  value: string;
}

export interface Image extends ContentBase {
  type: 'image';
  src: string;
}

export interface Word extends ContentBase {
  type: 'word';
  value: string;
}

export interface Bold extends ContentBase {
  type: 'bold';
  value: string;
}

export interface Line extends ContentBase {
  type: 'line';
  value: string;
}

export interface Poem extends ContentBase {
  type: 'poem';
  title: string;
  lines: Line[];
}

export interface FooterPassage extends ContentBase {
  type: 'footer_passage';
  value: string;
}

export interface TableCell {
  value: string;
  style?: {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  colspan?: number;
}

export interface Table extends ContentBase {
  type: 'table';
  data: TableCell[];
}

export type ContentItem = Chapter | Heading | Hints | Paragraph | Page | Image | Word | Bold | Poem | Italic | FooterPassage | Verse | Line | Table;

export type BookChapter = ContentItem[];

export interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  paragraph: Paragraph;
  tamilPage: string | null;
  englishPage: string | null;
}
