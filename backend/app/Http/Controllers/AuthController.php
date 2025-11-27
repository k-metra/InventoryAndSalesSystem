<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'username' => 'required|string|max:40',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only('username', 'password');

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid username or password.'], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    public function logout(Request $request) {
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.'
        ], 201);
    }
}
