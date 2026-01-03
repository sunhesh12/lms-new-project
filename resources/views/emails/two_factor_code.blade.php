<!DOCTYPE html>
<html>
<head>
    <title>Login Verification Code</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .code { font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; text-align: center; padding: 20px; background: #eff6ff; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Login Verification</h2>
        </div>
        <p>Hello,</p>
        <p>You are attempting to log in to the LMS. Please use the following verification code to complete your login:</p>
        
        <div class="code">{{ $code }}</div>
        
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not attempt to log in, please contact support immediately.</p>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} LMS System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
