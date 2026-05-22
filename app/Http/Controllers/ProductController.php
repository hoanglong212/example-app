<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->string('search') . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->integer('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->integer('max_price'));
        }

        match ($request->string('sort')->toString()) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'stock_desc' => $query->orderByDesc('stock'),
            default => $query->latest(),
        };

        return response()->json($query->get());
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request);
        }

        $product = Product::create($data)->load('category');

        return response()->json($product, 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $this->deleteImage($product);

            $data['image'] = $this->storeImage($request);
        }

        $product->update($data);

        return response()->json($product->refresh()->load('category'));
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->deleteImage($product);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    private function storeImage(ProductRequest $request): string
    {
        $image = $request->file('image');
        $filename = time() . '_' . Str::random(8) . '.' . $image->getClientOriginalExtension();

        return $image->storeAs('products', $filename, 'public');
    }

    private function deleteImage(Product $product): void
    {
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
    }
}
