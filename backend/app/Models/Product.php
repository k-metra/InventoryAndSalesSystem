<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Supplier;
use App\Models\Category;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'sku',
        'price',
        'vat_exempt',
        'cost',
        'stock',
        'category_id',
        'supplier_id',
    ];

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    // TODO: Define relationships here
    // Mainly supplier and category
}
