<?php

namespace Database\Seeders;

use App\Models\LectureMaterial;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class LectureMaterialSeeder extends Seeder
{
    public function run()
    {
        $topics = Topic::all();

        if ($topics->isEmpty()) {
            $this->command->warn('No topics found. Please seed topics first.');
            return;
        }

        $youtubeLinks = [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=3fumBcKC6RE',
            'https://www.youtube.com/watch?v=V-_O7nl0Ii0',
            'https://www.youtube.com/watch?v=5MgBikgcWnY',
            'https://www.youtube.com/watch?v=rfscVS0vtbw',
        ];

        $pdfLinks = [
            'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'https://www.orimi.com/pdf-test.pdf',
            'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
            'https://css4.pub/2015/icelandic/dictionary.pdf',
            'https://www.africau.edu/images/default/sample.pdf',
        ];

        $audioLinks = [
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'https://file-examples.com/storage/fec5ed2c6a70257e33d43f2/2017/11/file_example_MP3_700KB.mp3',
            'https://filesamples.com/samples/audio/mp3/sample3.mp3',
            'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
            'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        ];

        $videoFiles = [
            'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
            'https://file-examples.com/storage/fe7b27c2e9a11fb889cf16f/2017/04/file_example_MP4_480_1_5MG.mp4',
            'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
            'https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4',
        ];

        foreach ($topics as $topic) {
            $materialsCount = rand(2, 4); // 2 to 4 materials per topic

            for ($i = 0; $i < $materialsCount; $i++) {
                $type = fake()->randomElement(['video', 'document', 'audio', 'video_file']);

                $url = match ($type) {
                    'video' => fake()->randomElement($youtubeLinks),
                    'document' => fake()->randomElement($pdfLinks),
                    'audio' => fake()->randomElement($audioLinks),
                    'video_file' => fake()->randomElement($videoFiles),
                };

                LectureMaterial::create([
                    'material_type' => $type === 'video_file' ? 'video' : $type,
                    'material_title' => ucfirst(str_replace('_', ' ', $type)) . ' Material for ' . $topic->title,
                    'material_url' => $url,
                    'topic_id' => $topic->id
                ]);
            }
        }

        $this->command->info('Lecture materials (YouTube, PDFs, Audio, MP4s) seeded successfully.');
    }
}
