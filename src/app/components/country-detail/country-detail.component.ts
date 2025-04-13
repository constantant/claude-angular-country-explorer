import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Country } from '../../models/country';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CountryDetailComponent implements OnInit {
  country: Country | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('name');
    if (countryName) {
      this.loadCountry(countryName);
    } else {
      this.router.navigate(['/']);
    }
  }

  private loadCountry(name: string): void {
    this.isLoading = true;
    this.countryService.getCountryByName(name).subscribe({
      next: (countries) => {
        if (countries.length > 0) {
          this.country = countries[0];
        } else {
          this.error = 'Country not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load country details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getLanguages(): string {
    if (!this.country?.languages) return '';
    return Object.values(this.country.languages).join(', ');
  }

  getCurrencies(): string {
    if (!this.country?.currencies) return '';
    return Object.values(this.country.currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  }
}
