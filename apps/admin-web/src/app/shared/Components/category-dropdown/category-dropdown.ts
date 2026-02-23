import { Component, OnInit, signal, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeUIModules } from '@offer-app/shared';
import { GetCategoriesService, Category } from '../../services/get-categories.service';

@Component({
  selector: 'app-category-dropdown',
  imports: [ReactiveFormsModule, FormsModule, PrimeUIModules],
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.css',
})
export class CategoryDropdownComponent implements OnInit {
  @Input() label: string = 'Select Category';
  @Input() placeholder: string = 'Select category';
  @Input() multiple: boolean = false;
  @Input() required: boolean = false;
  @Input() control!: FormControl;

  categories = signal<Category[]>([]);

  constructor(private categoryService: GetCategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        // Filter active categories only
        const activeCategories = res.filter(cat => cat.isActive !== false);
        this.categories.set(activeCategories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories.set([]);
      },
    });
  }
}
