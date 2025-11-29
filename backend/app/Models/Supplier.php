<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Supplier extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'contact_person',
        'phone',
        'address',
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function category() {
        return $this->hasMany(Product::class);
    }
}
