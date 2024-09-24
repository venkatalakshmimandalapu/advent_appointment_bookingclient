import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';  // Import HttpClient
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), HttpClientModule,
      // Add HttpClient provider
    ...appConfig.providers,
  ]
}).catch((err) => console.error(err));
