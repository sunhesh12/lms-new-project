<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseEnrolledNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $module;

    public function __construct($module)
    {
        $this->module = $module;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Enrollment Confirmed: ' . $this->module->title)
                    ->line('You have successfully enrolled in ' . $this->module->title . '.')
                    ->line('Module Code: ' . $this->module->code)
                    ->action('Go to Module', route('module.show', $this->module->id))
                    ->line('Welcome aboard!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Enrolled in ' . $this->module->title,
            'link' => route('module.show', $this->module->id),
            'type' => 'success'
        ];
    }
}
