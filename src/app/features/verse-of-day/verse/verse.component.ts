import { Component, OnInit } from '@angular/core';
import { Verse } from '../../../core/interfaces/verse.interface';
import { ApiService } from '../../../core/services/api.service';
import { catchError, map, Observable, of, retry } from 'rxjs';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
})
export class VerseComponent implements OnInit {
  verses: Verse[] = [];
  randomVerse: Verse | null = null;
  bookName: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  getBooks(): Observable<any[]> {
    return this.apiService.get<any>('books').pipe(
      map(response => response.books),
      catchError((error) => {
        console.error('Erro ao carregar livros:', error);
        return of([]);
      })
    );
  }

  getChapters(bookId: string): Observable<number[]> {
    const endpoint = `books/${bookId}/chapters`;
    return this.apiService.get<any>(endpoint).pipe(
      map(response => response.chapters),
      catchError((error) => {
        console.error('Erro ao carregar capítulos:', error);
        return of([]);
      })
    );
  }

  getVerses(bookId: string, chapterId: string): Observable<Verse[]> {
    const endpoint = `books/${bookId}/chapters/${chapterId}/verses`;
    return this.apiService.get<any>(endpoint).pipe(
      retry(1),
      catchError((error) => {
        console.error('Erro ao carregar versículos:', error);
        return of([]);
      }),
      map((response) => {
        return response.verses.map((verse: any) => ({
          id: verse.id,
          version: verse.version,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
          book_id: verse.book_id
        }));
      })
    );
  }

  ngOnInit(): void {
    this.getBooks().subscribe({
      next: (books) => {
        if (!books.length) {
          this.errorMessage = 'Nenhum livro disponível.';
          return;
        }

        const randomBook = books[Math.floor(Math.random() * books.length)];
        const bookId = randomBook.id;

        this.getChapters(bookId).subscribe({
          next: (chapters) => {
            if (!chapters.length) {
              this.errorMessage = 'Nenhum capítulo disponível.';
              return;
            }

            let randomChapter:number;
            do {
              randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
            } while (randomChapter === 1);

            this.getVerses(bookId.toString(), randomChapter.toString()).subscribe({
              next: (verses) => {
                if (!verses.length) {
                  this.errorMessage = 'Nenhum versículo encontrado.';
                  return;
                }

                let randomVerse: Verse;
                do {
                  randomVerse = verses[Math.floor(Math.random() * verses.length)];
                } while (randomVerse.verse === 1);

                this.randomVerse = randomVerse;
                this.bookName = randomBook.name;
              },
              error: () => this.errorMessage = 'Erro ao carregar versículos.'
            });
          },
          error: () => this.errorMessage = 'Erro ao carregar capítulos.'
        });
      },
      error: () => this.errorMessage = 'Erro ao carregar livros.'
    });
  }
}
