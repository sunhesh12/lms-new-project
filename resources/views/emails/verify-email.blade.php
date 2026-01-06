<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-muted: #64748b;
        }

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
            table-layout: fixed;
            background-color: #f8fafc;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .header {
            background-color: #2563eb;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
        }

        .content {
            padding: 40px;
            background-color: #ffffff;
        }

        .content p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #475569;
        }

        .content strong {
            color: #1e293b;
        }

        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s ease;
        }

        .button:hover {
            background-color: #1d4ed8;
        }

        .footer {
            padding: 32px;
            text-align: center;
            background-color: #f1f5f9;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            margin: 0;
            font-size: 14px;
            color: #64748b;
        }

        .sub-footer {
            padding: 24px 40px;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }

        .sub-footer a {
            color: #2563eb;
            word-break: break-all;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>LMS Platform</h1>
            </div>
            <div class="content">
                <p>Hello <strong>{{ $name }}</strong>,</p>
                <p>Please click the button below to verify your email address and complete your registration. This link
                    will help us ensure that your account is secure.</p>

                <div class="button-container">
                    <a href="{{ $url }}" class="button">Verify Email Address</a>
                </div>

                <p>If you did not create an account, no further action is required.</p>

                <p>Regards,<br><strong>The LMS Team</strong></p>
            </div>
            <div class="sub-footer">
                <p>If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below
                    into your web browser: <a href="{{ $url }}">{{ $url }}</a></p>
            </div>
            <div class="footer">
                <p>&copy; {{ date('Y') }} LMS Platform. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>

</html>