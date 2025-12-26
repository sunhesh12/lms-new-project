<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Models\Conversation;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function (User $user, $conversationId) {
    $conversation = Conversation::find($conversationId);
    return $conversation && $conversation->users->contains($user->id);
});
