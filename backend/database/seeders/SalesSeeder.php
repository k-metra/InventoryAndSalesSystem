<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Customer;

class SalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $customers = Customer::all();

        for ($i = 0; $i < 50; $i++) {
            $customer = $customers->random() ?? null;

            $sale = Sale::create([
                'customer_id' => $customer?->id,
                'payment_method' => ['Cash', 'Credit Card', 'GCash'][rand(0,2)],
                'total' => 0, // Temporary, will compute later
            ]);

            $total = 0;

            $saleProducts = $products->random(rand(1, 5));

            foreach ($saleProducts as $product) {
                $quantity = rand(1,3);
                $price = $product->price;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price_at_sale' => $price,
                ]);

                $total += $price * $quantity;

                $product->decrement('stock', $quantity);  
            }

            $sale->update(['total' => $total]);
        }
    }
}
