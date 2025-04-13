import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Country } from '../../models/country';
import { CountryService } from '../../services/country.service';
import { CapitalFormatPipe } from '../../pipes/capital-format.pipe';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    CapitalFormatPipe
  ]
})
export class CountryListComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries$!: Observable<Country[]>;
  searchControl = new FormControl('');
  regionControl = new FormControl('');
  regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  isLoading = true;
  error: string | null = null;

  constructor(
    private countryService: CountryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  private loadCountries(): void {
    this.isLoading = true;
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.isLoading = false;
        this.setupFiltering();
      },
      error: (error) => {
        this.error = 'Failed to load countries. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private setupFiltering(): void {
    const search$ = this.searchControl.valueChanges.pipe(startWith(''));
    const region$ = this.regionControl.valueChanges.pipe(startWith(''));

    this.filteredCountries$ = combineLatest([search$, region$]).pipe(
      map(([search, region]) => {
        return this.countries.filter(country => {
          const matchesSearch = search
            ? country.name.common.toLowerCase().includes(search.toLowerCase())
            : true;
          const matchesRegion = region
            ? country.region.toLowerCase() === region.toLowerCase()
            : true;
          return matchesSearch && matchesRegion;
        });
      })
    );
  }

  viewCountryDetails(country: Country): void {
    this.router.navigate(['/country', country.name.common]);
  }
}
