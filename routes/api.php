<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use paupololi\sheetsformbuilder\Http\Controllers\API\SheetsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('sheets/form/{id}',[SheetsController::class, 'index']);
Route::get('sheets/getrecord/{entityname}/{recordid}',[SheetsController::class, 'getrecord']);
Route::get('sheets/entity/info/{id}',[SheetsController::class, 'entity_info']);
Route::post('sheets/save/file',[SheetsController::class, 'saveFile']);
Route::post('sheets/save/form',[SheetsController::class, 'sendForm']);
Route::post('sheets/save/form/update',[SheetsController::class, 'sendFormUpdate']);
