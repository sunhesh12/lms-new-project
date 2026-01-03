<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignmentSubmittedNotification extends Notification
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
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Submission Received: ' . $this->assignment->title)
                    ->line('We have received your submission for ' . $this->assignment->title . '.')
                    ->line('Submitted at: ' . now()->toDateTimeString())
                    ->action('View Submission', route('module.show', $this->assignment->module_id))
                    ->line('Keep up the good work!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
