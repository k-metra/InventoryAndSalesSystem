<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum'])->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    return response()->json([
        'user' => auth()->user(),
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/all', [ProductController::class, 'count']); // Move this before {id} route
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    //Suppliers
    Route::post('/suppliers', [SupplierController::class, 'store']);
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
    Route::get('/suppliers/{id}', [SupplierController::class, 'show']);
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);

    // Customers
    Route::get('/customers', [CustomerController::class, 'index']);
});