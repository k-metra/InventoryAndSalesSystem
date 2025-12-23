<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Customer;
use App\Models\SaleItem;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'payment_method',
        'subtotal',
        'discount_amount',
        'vat_rate',
        'vat_amount',
        'total',
    ];

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    public function items() {
        return $this->hasMany(SaleItem::class);
    }
}
