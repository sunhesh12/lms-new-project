<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignmentDueNotification extends Notification
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
                    ->subject('Assignment Due Soon: ' . $this->assignment->title)
                    ->line('This is a reminder that you have an assignment due tomorrow.')
                    ->line('Title: ' . $this->assignment->title)
                    ->line('Due Date: ' . $this->assignment->deadline)
                    ->action('View Assignment', route('module.show', $this->assignment->module_id))
                    ->line('Please submit on time!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Assignment Due: ' . $this->assignment->title,
            'link' => route('module.show', $this->assignment->module_id),
            'type' => 'error'
        ];
    }
}
