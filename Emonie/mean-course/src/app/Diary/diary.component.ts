import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryService } from './diary.service';
import { Diary } from './diary.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSmile, 
  faSadTear, 
  faAngry, 
  faFlushed, 
  faMeh,
  faTrash,
  faPencilAlt,
  faSave,
  faTimes,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

type Emotion = 'Joy' | 'Sadness' | 'Anger' | 'Anxiety' | 'Numb';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  providers: [DiaryService],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {
  // Font Awesome icons
  faSmile = faSmile;
  faSadTear = faSadTear;
  faAngry = faAngry;
  faFlushed = faFlushed;
  faMeh = faMeh;
  faTrash = faTrash;
  faPencilAlt = faPencilAlt;
  faSave = faSave;
  faTimes = faTimes;
  faEdit = faEdit;

  diaries: Diary[] = [];
  filteredDiaries: Diary[] = [];
  showCreateForm = false;
  selectedFilter = '';
  errorMessage = '';
  editingDiary: Diary | null = null;

  emotions: Emotion[] = ['Joy', 'Sadness', 'Anger', 'Anxiety', 'Numb'];

  newDiary: Diary = {
    title: '',
    content: '',
    emotion: 'Joy',
    date: new Date()
  };

  constructor(private diaryService: DiaryService) {}

  ngOnInit(): void {
    this.loadDiaries();
  }

  loadDiaries(): void {
    this.diaryService.getDiaries().subscribe({
      next: (diaries) => {
        this.diaries = diaries;
        this.filterDiaries();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading diaries:', error);
        this.errorMessage = 'Failed to load diary entries. Please try again.';
      }
    });
  }

  filterDiaries(): void {
    this.filteredDiaries = this.selectedFilter
      ? this.diaries.filter(diary => diary.emotion === this.selectedFilter)
      : this.diaries;
  }

  addDiary(): void {
    if (!this.validateDiary(this.newDiary)) {
      return;
    }

    this.diaryService.addDiary(this.newDiary).subscribe({
      next: () => {
        this.loadDiaries();
        this.resetForm();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error adding diary:', error);
        this.errorMessage = 'Failed to save diary entry. Please try again.';
      }
    });
  }

  validateDiary(diary: Diary): boolean {
    if (!diary.title.trim()) {
      this.errorMessage = 'Please enter a title.';
      return false;
    }
    if (!diary.content.trim()) {
      this.errorMessage = 'Please enter some content.';
      return false;
    }
    if (!diary.emotion) {
      this.errorMessage = 'Please select an emotion.';
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.newDiary = {
      title: '',
      content: '',
      emotion: 'Joy',
      date: new Date()
    };
    this.showCreateForm = false;
    this.editingDiary = null;
  }

  startEdit(diary: Diary): void {
    this.editingDiary = { ...diary };
    this.showCreateForm = false;
  }

  cancelEdit(): void {
    this.editingDiary = null;
  }

  saveEdit(): void {
    if (!this.editingDiary || !this.editingDiary._id) {
      return;
    }

    if (!this.validateDiary(this.editingDiary)) {
      return;
    }

    this.diaryService.updateDiary(this.editingDiary._id, this.editingDiary).subscribe({
      next: () => {
        this.loadDiaries();
        this.editingDiary = null;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error updating diary:', error);
        this.errorMessage = 'Failed to update diary entry. Please try again.';
      }
    });
  }

  deleteDiary(id: string | undefined): void {
    if (!id) {
      this.errorMessage = 'Cannot delete diary: Invalid ID';
      return;
    }
    
    this.diaryService.deleteDiary(id).subscribe({
      next: () => {
        this.loadDiaries();
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error deleting diary:', error);
        this.errorMessage = 'Failed to delete diary entry. Please try again.';
      }
    });
  }

  getEmotionIcon(emotion: Emotion) {
    switch (emotion) {
      case 'Joy':
        return this.faSmile;
      case 'Sadness':
        return this.faSadTear;
      case 'Anger':
        return this.faAngry;
      case 'Anxiety':
        return this.faFlushed;
      case 'Numb':
        return this.faMeh;
      default:
        return this.faSmile;
    }
  }
}
