<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum'])->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    return response()->json([
        'user' => auth()->user(),
    ]);
});
