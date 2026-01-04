<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Message;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Status;
use Illuminate\Support\Facades\DB;

class EncryptExistingData extends Command
{
    protected $signature = 'encrypt:existing-data';
    protected $description = 'Encrypt existing sensitive data in the database';

    public function handle()
    {
        $this->info('Starting data encryption check/fix...');

        $this->encryptTable('users', ['name', 'email', 'user_phone_no', 'user_dob', 'address']);
        $this->encryptTable('messages', ['body']);
        $this->encryptTable('comments', ['content']);
        $this->encryptTable('posts', ['content']);
        $this->encryptTable('statuses', ['content']);
        $this->encryptTable('modules', ['enrollment_key']);

        $this->info('Encryption processing complete!');
    }

    private function encryptTable($table, $fields)
    {
        $this->info("Processing table: $table");
        DB::table($table)->get()->each(function ($row) use ($table, $fields) {
            $updates = [];
            foreach ($fields as $field) {
                $value = $row->$field;
                if ($value === null)
                    continue;

                // 1. Decrypt as much as possible to get to original plaintext
                $plaintext = $value;
                try {
                    while (true) {
                        // Check if it looks like an encrypted string (base64 JSON)
                        $decoded = json_decode(base64_decode($plaintext), true);
                        if (is_array($decoded) && isset($decoded['iv'], $decoded['value'], $decoded['mac'])) {
                            // Try decryptString first (plaintext)
                            try {
                                $plaintext = \Illuminate\Support\Facades\Crypt::decryptString($plaintext);
                            } catch (\Exception $e) {
                                // Fallback to decrypt() which handles serialization
                                $plaintext = \Illuminate\Support\Facades\Crypt::decrypt($plaintext);
                            }

                            // If the resulting plaintext is still a serialized string (s:21:"..."), unserialize it
                            if (is_string($plaintext) && preg_match('/^[asOibd]:[0-9]+[:;]/', $plaintext)) {
                                try {
                                    $unserialized = @unserialize($plaintext);
                                    if ($unserialized !== false || $plaintext === 'b:0;') {
                                        $plaintext = $unserialized;
                                    }
                                } catch (\Exception $e) {
                                    // Not actually serialized or failed
                                }
                            }
                        } else {
                            break;
                        }
                    }
                } catch (\Exception $e) {
                    // Fail safe
                }

                // 2. Encrypt once as string (what 'encrypted' cast expects)
                $updates[$field] = \Illuminate\Support\Facades\Crypt::encryptString($plaintext);

                // 3. Special handling for email_bindex
                if ($field === 'email') {
                    $updates['email_bindex'] = User::generateBlindIndex($plaintext);
                }
            }

            if (!empty($updates)) {
                DB::table($table)->where('id', $row->id)->update($updates);
            }
        });
    }
}
