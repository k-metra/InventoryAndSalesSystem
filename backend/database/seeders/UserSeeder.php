<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
        ]);

        DB::table('users')->insert([
            'username' => 'staff',
            'password' => Hash::make('staff123'),
            'role' => 'Staff',
        ]);
    }
}
