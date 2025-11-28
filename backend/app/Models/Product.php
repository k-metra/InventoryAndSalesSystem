<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'sku',
        'price',
        'cost',
        'stock',
        'category_id',
        'supplier_id',
    ];

    // TODO: Define relationships here
    // Mainly supplier and category
}
