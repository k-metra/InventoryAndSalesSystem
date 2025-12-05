<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Supplier::withCount('products')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
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
