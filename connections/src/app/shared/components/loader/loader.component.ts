import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent {
  isLoading = false;

  constructor(public loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.isLoading.subscribe((isLoad) => {
      return (this.isLoading = isLoad);
    });
  }
}
