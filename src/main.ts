import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';  // Import HttpClient
import { appConfig } from './app/app.config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), HttpClientModule,
      // Add HttpClient provider
    ...appConfig.providers, provideAnimationsAsync(),
  ]
}).catch((err) => console.error(err));
