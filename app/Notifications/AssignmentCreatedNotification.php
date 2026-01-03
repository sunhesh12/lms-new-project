<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignmentCreatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $assignment;

    public function __construct($assignment)
    {
        $this->assignment = $assignment;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('New Assignment: ' . $this->assignment->title)
                    ->line('A new assignment has been posted in your module.')
                    ->line('Title: ' . $this->assignment->title)
                    ->line('Due Date: ' . $this->assignment->deadline)
                    ->action('View Assignment', route('module.show', $this->assignment->module_id))
                    ->line('Good luck!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'New Assignment: ' . $this->assignment->title,
            'link' => route('module.show', $this->assignment->module_id),
            'type' => 'info'
        ];
    }
}
