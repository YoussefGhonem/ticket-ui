import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { IConfigModel } from "environments/environment.model";
import { environment } from "environments/environment";
import { AppModule } from "app/app.module";


fetch('assets/settings.json')
  .then(response => response.json())
  .then((config: IConfigModel) => {

    if (config.production) {
      enableProdMode();
      if (window) { // to remove all console.log() in prod mode
        window.console.log = function () {
        };
      }
    }

    environment.config = config; // update environment

    const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

    bootstrap().catch(err => console.log(err));

  });


