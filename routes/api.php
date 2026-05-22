<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);

Route::apiResource('products', ProductController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy']);
