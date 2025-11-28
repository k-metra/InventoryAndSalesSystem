<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'sku' => strtoupper($this->faker->bothify('???-#####')),
            'price' => $this->faker->randomFloat(2, 5, 500),
            'cost' => $this->faker->randomFloat(2, 1, 300),
            'stock' => $this->faker->numberBetween(0, 100),
            'category_id' => 1,
            'supplier_id' => 1
        ];
    }
}
