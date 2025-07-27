Sure, here's the contents for the file `/my-laravel-app/my-laravel-app/resources/views/fees/index.blade.php`:

@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Fee Management</h1>
    <table class="table">
        <thead>
            <tr>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Class</th>
                <th>Term</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($fees as $fee)
            <tr>
                <td>{{ $fee->user->name }}</td>
                <td>{{ $fee->user->admission_no }}</td>
                <td>{{ $fee->class }}</td>
                <td>{{ $fee->term }}</td>
                <td>₦{{ number_format($fee->amount, 2) }}</td>
                <td>₦{{ number_format($fee->paid, 2) }}</td>
                <td>₦{{ number_format($fee->balance, 2) }}</td>
                <td>{{ $fee->due_date }}</td>
                <td>
                    <span class="status-badge {{ $fee->status }}">{{ ucfirst($fee->status) }}</span>
                </td>
                <td>
                    <a href="{{ route('fees.show', $fee->id) }}" class="btn btn-info">View</a>
                    <a href="{{ route('fees.edit', $fee->id) }}" class="btn btn-warning">Edit</a>
                    <form action="{{ route('fees.destroy', $fee->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection