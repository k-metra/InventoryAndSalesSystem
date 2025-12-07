<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Customer;

class CustomerController extends Controller
{
    protected $validations = [
        'create' => [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
        ],

        'update' => [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
        ],
    ];

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {

        $searchQuery = $request->query('search');

        $query = Customer::query();

        if ($searchQuery && trim($searchQuery) !== '') {
            $query = $query->where('name', 'like', "%{$searchQuery}%")
                    ->orWhere('email', 'like', "%{$searchQuery}%")
                    ->orWhere('phone', 'like', "%{$searchQuery}%");
        }
        
        $query = $query->orderBy('id','desc')->paginate(10)->withQueryString();

        return response()->json($query);
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
        $customer = Customer::findOrFail($id);

        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        $validated_data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('customers')->ignore($customer->id),
            ],
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update($validated_data);

        return response()->json($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.'
        ], 200);
    }
}
