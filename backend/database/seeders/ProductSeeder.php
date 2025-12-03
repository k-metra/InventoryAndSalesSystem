<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Mouse',
                'sku' => 'WM-1001',
                'price' => 950.00,
                'cost' => 600.00,
                'stock' => 12,
                'category_id' => 1,
                'supplier_id' => 1,
            ],
            [
                'name' => 'Mechanical Keyboard',
                'sku' => 'MK-2002',
                'price' => 3500.00,
                'cost' => 2500.00,
                'stock' => 25,
                'category_id' => 1,
                'supplier_id' => 2,
            ],
            [
                'name' => 'Gaming Headset',
                'sku' => 'GH-1003',
                'price' => 2200.00,
                'cost' => 1500.00,
                'stock' => 8,
                'category_id' => 1,
                'supplier_id' => 1,
            ],
            [
                'name' => 'USB-C Hub',
                'sku' => 'UH-1004',
                'price' => 1250.00,
                'cost' => 800.00,
                'stock' => 30,
                'category_id' => 2,
                'supplier_id' => 2,
            ],
            [
                'name' => 'External SSD 500GB',
                'sku' => 'ES1005',
                'price' => 4800.00,
                'cost' => 3500.00,
                'stock' => 5,
                'category_id' => 2,
                'supplier_id' => 1,
            ],
            [
                'name' => 'Webcam 1080p',
                'sku' => 'WC1006',
                'price' => 1800.00,
                'cost' => 1200.00,
                'stock' => 18,
                'category_id' => 3,
                'supplier_id' => 2,
            ],
            [
                'name' => 'Bluetooth Speaker',
                'sku' => 'BS1007',
                'price' => 1500.00,
                'cost' => 900.00,
                'stock' => 10,
                'category_id' => 3,
                'supplier_id' => 1,
            ],
            [
                'name' => 'Laptop Stand',
                'sku' => 'LS1008',
                'price' => 1200.00,
                'cost' => 700.00,
                'stock' => 20,
                'category_id' => 2,
                'supplier_id' => 2,
            ],
            [
                'name' => 'Portable Charger 10000mAh',
                'sku' => 'PC1009',
                'price' => 900.00,
                'cost' => 550.00,
                'stock' => 7,
                'category_id' => 3,
                'supplier_id' => 1,
            ],
            [
                'name' => 'Smart LED Strip',
                'sku' => 'SL1010',
                'price' => 1500.00,
                'cost' => 1000.00,
                'stock' => 22,
                'category_id' => 3,
                'supplier_id' => 2,
            ],
        ];

        DB::table('products')->insert($products);
    }
}
