<?php

namespace paupololi\sheetsformbuilder;

use Illuminate\Support\ServiceProvider;

class SheetsFormBuilderProvider extends ServiceProvider
{
  public function register()
  {
    //
  }

  public function boot()
  {
    $this->loadRoutesFrom(__DIR__.'/../routes/api.php');

    if ($this->app->runningInConsole()) {
        $this->publishes([
          __DIR__.'/../resources/js' => resource_path('js/vendor/FormBuilder_js'),
          __DIR__.'/../resources/sass' => resource_path('js/vendor/FormBuilder_js/sass'),
        ], 'assets');
      }
  }
}