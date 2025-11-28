<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
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
