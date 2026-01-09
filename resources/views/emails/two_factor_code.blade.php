<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Verification Code</title>
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
            text-align: center;
        }

        .content p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #475569;
            text-align: left;
        }

        .code-display {
            font-size: 42px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: 12px;
            padding: 32px;
            background: #f5f3ff;
            border: 2px dashed #c7d2fe;
            border-radius: 16px;
            margin: 32px 0;
            display: inline-block;
            width: 80%;
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

        .alert-box {
            padding: 16px;
            background-color: #fff1f2;
            border-radius: 8px;
            font-size: 14px;
            color: #e11d48;
            border: 1px solid #fecdd3;
            text-align: left;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>LMS SECURITY</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>You are attempting to log in to the LMS Platform. To verify your identity, please use the secure verification code below:</p>

                <div class="code-display">{{ $code }}</div>

                <p>This code will expire in <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
                
                <div class="divider"></div>
                
                <div class="alert-box">
                    <strong>Notice:</strong> If you did not attempt to log in, please secure your account and contact support immediately.
                </div>
            </div>
            <div class="footer">
                <p><strong>LMS Security Systems</strong></p>
                <p>&copy; {{ date('Y') }} LMS Platform. All rights reserved.</p>
                <p>Secure Academic Infrastructure</p>
            </div>
        </div>
    </div>
</body>

</html>
