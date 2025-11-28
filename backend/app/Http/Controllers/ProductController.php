<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['products' => Product::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'sku'           => 'required|string|unique:products,sku',
            'price'         => 'required|numeric|min:0',
            'cost'          => 'nullable|numeric|min:0',
            'stock'         => 'nullable|integer|min:0',
            'category_id'   => 'nullable|integer|exists:categories,id',
            'supplier_id'   => 'nullable|integer|exists:suppliers,id',
        ]);

        $product = Product::create($validated_data);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json(['product' => $product]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated_data = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|nullable|string',
            'sku'           => 'sometimes|required|string|unique:products,sku,' . $product->id,
            'price'         => 'sometimes|required|numeric|min:0',
            'cost'          => 'sometimes|nullable|numeric|min:0',
            'stock'         => 'sometimes|nullable|integer|min:0',
            'category_id'   => 'sometimes|nullable|integer|exists:categories,id',
            'supplier_id'   => 'sometimes|nullable|integer|exists:suppliers,id',
        ]);

        $product->update($validated_data);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function count() {
        $count = Product::count();
        return response()->json(['count' => $count]);
    }
}
