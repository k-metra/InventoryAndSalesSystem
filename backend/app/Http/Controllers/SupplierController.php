<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Supplier::withCount('products');
        $search = $request->query('search');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('contact_person', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
        }
        

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'name' => 'required|string|max:255|unique:suppliers,name',
            'email' => 'required|email|max:255|unique:suppliers,email',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $supplier = Supplier::create($validated_data);
        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $supplier = Supplier::withCount('products')->findOrFail($id);

        return response()->json($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validated_data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'contact_person' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
        ]);

        $supplier->update($validated_data);

        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = Supplier::withCount('products')->findOrFail($id);

        if ($supplier->products_count > 0) {
            return response()->json([
                'message' => 'Cannot delete supplier with associated products.'
            ], 400);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully.'
        ], 200);
    }
}
