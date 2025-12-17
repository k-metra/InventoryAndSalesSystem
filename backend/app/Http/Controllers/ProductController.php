<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {   
        $sortingOptions = [
            "A-Z" => ['name', 'ASC'],
            "Z-A" => ['name', 'DESC'],
            "Higher Price" => ['price', 'DESC'],
            "Lower Price" => ['price', 'ASC'],
            "Greater Stock" => ['stock', 'DESC'],
            "Lower Stock" => ['stock', 'ASC'],
            "Greater Cost" => ['cost', 'DESC'],
            "Lower Cost" => ['cost', 'ASC'],
        ];

        $search = $request->query('search');
        $category = $request->query('category');
        $supplier = $request->query('supplier');

        // True by default
        $prioritizeLowStock = $request->query('prioritizeLowStock') === 'true' || $request->query('prioritizeLowStock') === null;

        $query = Product::with(['category', 'supplier']);

        if ($prioritizeLowStock) {
            $query->orderByRaw('CASE WHEN stock <= 15 THEN 0 ELSE 1 END');
        }

        $sortBy = $request->query('sortBy');

        if ($sortBy && array_key_exists($sortBy, $sortingOptions)) {
            $query->orderBy(...$sortingOptions[$sortBy]);
        } else {
            $query
             ->orderBy('id', 'ASC');
        }

        if ($search) {
            $query->where('name','like', "%{$search}%")
            ->orWhere('sku','like', "%{$search}%");
        }

        if ($category) {
            $query->where('category_id', $category);
        }

        if ($supplier) {
            $query->where('supplier_id', $supplier);
        }

        $products = $query->paginate(10)->withQueryString();

        return response()->json($products);
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
        $product = Product::with(['category', 'supplier'])->findOrFail($id);
        return response()->json($product);
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
        $totalProducts = Product::count();
        $totalInventoryValue = Product::sum(DB::raw('cost * stock'));
        return response()->json([
            'totalProducts' => $totalProducts,
            'totalInventoryValue' => $totalInventoryValue
        ]);
    }
}
