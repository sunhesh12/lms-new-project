<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Reset Password' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }

        .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }

        .header {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            padding: 48px 40px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 48px 40px;
            background-color: #ffffff;
        }

        .content p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #475569;
        }

        .content strong {
            color: #1e293b;
            font-weight: 600;
        }

        .button-container {
            text-align: center;
            margin: 40px 0;
        }

        .button {
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff !important;
            padding: 16px 36px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
            transition: all 0.2s ease;
        }

        .footer {
            padding: 40px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #f1f5f9;
        }

        .footer p {
            margin: 4px 0;
            font-size: 14px;
            color: #64748b;
        }

        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 32px 0;
        }

        .url-box {
            padding: 16px;
            background-color: #f1f5f9;
            border-radius: 8px;
            font-size: 12px;
            word-break: break-all;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .url-box a {
            color: #6366f1;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>{{ $header ?? 'LMS Platform' }}</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>{{ $introMessage ?? 'You are receiving this email because we received a password reset request for your account.' }}</p>

                <div class="button-container">
                    <a href="{{ $actionUrl }}" class="button">{{ $actionText ?? 'Reset Password' }}</a>
                </div>

                <p>{{ $subMessage ?? 'If you did not request a password reset, no further action is required.' }}</p>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; margin-bottom: 8px;">If the button doesn't work, copy and paste this link:</p>
                <div class="url-box">
                    <a href="{{ $actionUrl }}">{{ $actionUrl }}</a>
                </div>
            </div>
            <div class="footer">
                <p><strong>LMS Academy Support</strong></p>
                <p>&copy; {{ date('Y') }} LMS Platform. All rights reserved.</p>
                <p>Secure Academic Systems</p>
            </div>
        </div>
    </div>
</body>

</html>
