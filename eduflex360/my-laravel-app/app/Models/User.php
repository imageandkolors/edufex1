<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    public function fees()
    {
        return $this->hasMany(Fee::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}