<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(100, 10000),
            'stock' => fake()->numberBetween(1, 100),
            'image' => null,
            'category_id' => \App\Models\Category::inRandomOrder()->first()->id ?? 1,
        ];
    }
}
