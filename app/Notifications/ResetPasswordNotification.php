<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword;

class ResetPasswordNotification extends ResetPassword
{
    /**
     * Build the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->view('emails.reset-password', [ 
                'header' => 'Reset Password',
                'title' => 'Reset Your Password',
                'introMessage' => 'You are receiving this email because we received a password reset request for your account. This password reset link will expire in 60 minutes.',
                'actionText' => 'Reset Password',
                'actionUrl' => url(route('password.reset', [
                    'token' => $this->token,
                    'email' => $notifiable->getEmailForPasswordReset(),
                ], false)),
                'subMessage' => 'If you did not request a password reset, no further action is required.',
            ]);
    }
}
