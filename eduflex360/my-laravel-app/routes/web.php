<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\TransactionController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Fee Routes
Route::get('/fees', [FeeController::class, 'index']);
Route::post('/fees', [FeeController::class, 'store']);
Route::put('/fees/{id}', [FeeController::class, 'update']);
Route::delete('/fees/{id}', [FeeController::class, 'destroy']);

// Transaction Routes
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/{id}', [TransactionController::class, 'show']);