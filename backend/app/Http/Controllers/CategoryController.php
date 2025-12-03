<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Category::withCount('products');

        $search = $request->query('search');

        if ($search) {
            $categories->where('name', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%");
        }

        return response()->json($categories->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
        ]);

        $category = Category::create($validated_data);
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('products')->where('id', $id)->firstOrFail();

        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated_data = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'description' => 'sometimes|nullable|string|max:255',
        ]);

        $category->update($validated_data);
        return response()->json($category, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category && $category->products_count > 0) {
            return response()->json([
                'error' => 'Cannot delete category with one or more products.'
            ], 403);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.'
        ], 201);
    }
}
