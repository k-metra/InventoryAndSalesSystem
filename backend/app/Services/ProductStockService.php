<?php

namespace App\Services;

use App\Models\Product;

class ProductStockService {
    public function increment(Product $product, int $amount): Product {
        $product->stock += $amount;
        $product->save();

        return $product;
    }

    public function decrement(Product $product, int $amount) : Product {
        $product->stock = max(0, $product->stock - $amount);
        $product->save();

        return $product;
    }
}