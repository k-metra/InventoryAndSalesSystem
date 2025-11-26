<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});
